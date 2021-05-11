"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correctVersionConflictsForContinuation = correctVersionConflictsForContinuation;
exports.savedObjectToConcreteTaskInstance = savedObjectToConcreteTaskInstance;
exports.TaskStore = void 0;

var _rxjs = require("rxjs");

var _lodash = require("lodash");

var _result_type = require("./lib/result_type");

var _task = require("./task");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * Wraps an elasticsearch connection and provides a task manager-specific
 * interface into the index.
 */


class TaskStore {
  /**
   * Constructs a new TaskStore.
   * @param {StoreOpts} opts
   * @prop {esClient} esClient - An elasticsearch client
   * @prop {string} index - The name of the task manager index
   * @prop {TaskDefinition} definition - The definition of the task being run
   * @prop {serializer} - The saved object serializer
   * @prop {savedObjectsRepository} - An instance to the saved objects repository
   */
  constructor(opts) {
    _defineProperty(this, "index", void 0);

    _defineProperty(this, "taskManagerId", void 0);

    _defineProperty(this, "errors$", new _rxjs.Subject());

    _defineProperty(this, "esClient", void 0);

    _defineProperty(this, "definitions", void 0);

    _defineProperty(this, "savedObjectsRepository", void 0);

    _defineProperty(this, "serializer", void 0);

    this.esClient = opts.esClient;
    this.index = opts.index;
    this.taskManagerId = opts.taskManagerId;
    this.definitions = opts.definitions;
    this.serializer = opts.serializer;
    this.savedObjectsRepository = opts.savedObjectsRepository;
  }
  /**
   * Convert ConcreteTaskInstance Ids to match their SavedObject format as serialized
   * in Elasticsearch
   * @param tasks - The task being scheduled.
   */


  convertToSavedObjectIds(taskIds) {
    return taskIds.map(id => this.serializer.generateRawId(undefined, 'task', id));
  }
  /**
   * Schedules a task.
   *
   * @param task - The task being scheduled.
   */


  async schedule(taskInstance) {
    this.definitions.ensureHas(taskInstance.taskType);
    let savedObject;

    try {
      savedObject = await this.savedObjectsRepository.create('task', taskInstanceToAttributes(taskInstance), {
        id: taskInstance.id,
        refresh: false
      });
    } catch (e) {
      this.errors$.next(e);
      throw e;
    }

    return savedObjectToConcreteTaskInstance(savedObject);
  }
  /**
   * Fetches a list of scheduled tasks with default sorting.
   *
   * @param opts - The query options used to filter tasks
   */


  async fetch({
    sort = [{
      'task.runAt': 'asc'
    }],
    ...opts
  } = {}) {
    return this.search({ ...opts,
      sort
    });
  }
  /**
   * Updates the specified doc in the index, returning the doc
   * with its version up to date.
   *
   * @param {TaskDoc} doc
   * @returns {Promise<TaskDoc>}
   */


  async update(doc) {
    const attributes = taskInstanceToAttributes(doc);
    let updatedSavedObject;

    try {
      updatedSavedObject = await this.savedObjectsRepository.update('task', doc.id, attributes, {
        refresh: false,
        version: doc.version
      });
    } catch (e) {
      this.errors$.next(e);
      throw e;
    }

    return savedObjectToConcreteTaskInstance( // The SavedObjects update api forces a Partial on the `attributes` on the response,
    // but actually returns the whole object that is passed to it, so as we know we're
    // passing in the whole object, this is safe to do.
    // This is far from ideal, but unless we change the SavedObjectsClient this is the best we can do
    { ...updatedSavedObject,
      attributes: (0, _lodash.defaults)(updatedSavedObject.attributes, attributes)
    });
  }
  /**
   * Updates the specified docs in the index, returning the docs
   * with their versions up to date.
   *
   * @param {Array<TaskDoc>} docs
   * @returns {Promise<Array<TaskDoc>>}
   */


  async bulkUpdate(docs) {
    const attributesByDocId = docs.reduce((attrsById, doc) => {
      attrsById.set(doc.id, taskInstanceToAttributes(doc));
      return attrsById;
    }, new Map());
    let updatedSavedObjects;

    try {
      ({
        saved_objects: updatedSavedObjects
      } = await this.savedObjectsRepository.bulkUpdate(docs.map(doc => ({
        type: 'task',
        id: doc.id,
        options: {
          version: doc.version
        },
        attributes: attributesByDocId.get(doc.id)
      })), {
        refresh: false
      }));
    } catch (e) {
      this.errors$.next(e);
      throw e;
    }

    return updatedSavedObjects.map((updatedSavedObject, index) => isSavedObjectsUpdateResponse(updatedSavedObject) ? (0, _result_type.asOk)(savedObjectToConcreteTaskInstance({ ...updatedSavedObject,
      attributes: (0, _lodash.defaults)(updatedSavedObject.attributes, attributesByDocId.get(updatedSavedObject.id))
    })) : (0, _result_type.asErr)({
      // The SavedObjectsRepository maintains the order of the docs
      // so we can rely on the index in the `docs` to match an error
      // on the same index in the `bulkUpdate` result
      entity: docs[index],
      error: updatedSavedObject
    }));
  }
  /**
   * Removes the specified task from the index.
   *
   * @param {string} id
   * @returns {Promise<void>}
   */


  async remove(id) {
    try {
      await this.savedObjectsRepository.delete('task', id);
    } catch (e) {
      this.errors$.next(e);
      throw e;
    }
  }
  /**
   * Gets a task by id
   *
   * @param {string} id
   * @returns {Promise<void>}
   */


  async get(id) {
    let result;

    try {
      result = await this.savedObjectsRepository.get('task', id);
    } catch (e) {
      this.errors$.next(e);
      throw e;
    }

    return savedObjectToConcreteTaskInstance(result);
  }
  /**
   * Gets task lifecycle step by id
   *
   * @param {string} id
   * @returns {Promise<void>}
   */


  async getLifecycle(id) {
    try {
      const task = await this.get(id);
      return task.status;
    } catch (err) {
      if (err.output && err.output.statusCode === 404) {
        return _task.TaskLifecycleResult.NotFound;
      }

      throw err;
    }
  }

  async search(opts = {}) {
    const {
      query
    } = ensureQueryOnlyReturnsTaskObjects(opts);

    try {
      const {
        body: {
          hits: {
            hits: tasks
          }
        }
      } = await this.esClient.search({
        index: this.index,
        ignore_unavailable: true,
        body: { ...opts,
          query
        }
      });
      return {
        docs: tasks.filter(doc => this.serializer.isRawSavedObject(doc)).map(doc => this.serializer.rawToSavedObject(doc)).map(doc => (0, _lodash.omit)(doc, 'namespace')).map(savedObjectToConcreteTaskInstance)
      };
    } catch (e) {
      this.errors$.next(e);
      throw e;
    }
  }

  async aggregate({
    aggs,
    query,
    size = 0
  }) {
    const {
      body
    } = await this.esClient.search({
      index: this.index,
      ignore_unavailable: true,
      body: ensureAggregationOnlyReturnsTaskObjects({
        query,
        aggs,
        size
      })
    });
    return body;
  }

  async updateByQuery(opts = {}, // eslint-disable-next-line @typescript-eslint/naming-convention
  {
    max_docs: max_docs
  } = {}) {
    const {
      query
    } = ensureQueryOnlyReturnsTaskObjects(opts);

    try {
      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        body: {
          total,
          updated,
          version_conflicts
        }
      } = await this.esClient.updateByQuery({
        index: this.index,
        ignore_unavailable: true,
        refresh: true,
        max_docs,
        conflicts: 'proceed',
        body: { ...opts,
          query
        }
      });
      const conflictsCorrectedForContinuation = correctVersionConflictsForContinuation(updated, version_conflicts, max_docs);
      return {
        total,
        updated,
        version_conflicts: conflictsCorrectedForContinuation
      };
    } catch (e) {
      this.errors$.next(e);
      throw e;
    }
  }

}
/**
 * When we run updateByQuery with conflicts='proceed', it's possible for the `version_conflicts`
 * to count against the specified `max_docs`, as per https://github.com/elastic/elasticsearch/issues/63671
 * In order to correct for that happening, we only count `version_conflicts` if we haven't updated as
 * many docs as we could have.
 * This is still no more than an estimation, as there might have been less docuemnt to update that the
 * `max_docs`, but we bias in favour of over zealous `version_conflicts` as that's the best indicator we
 * have for an unhealthy cluster distribution of Task Manager polling intervals
 */


exports.TaskStore = TaskStore;

function correctVersionConflictsForContinuation(updated, versionConflicts, maxDocs) {
  return maxDocs && versionConflicts + updated > maxDocs ? maxDocs - updated : versionConflicts;
}

function taskInstanceToAttributes(doc) {
  return { ...(0, _lodash.omit)(doc, 'id', 'version'),
    params: JSON.stringify(doc.params || {}),
    state: JSON.stringify(doc.state || {}),
    attempts: doc.attempts || 0,
    scheduledAt: (doc.scheduledAt || new Date()).toISOString(),
    startedAt: doc.startedAt && doc.startedAt.toISOString() || null,
    retryAt: doc.retryAt && doc.retryAt.toISOString() || null,
    runAt: (doc.runAt || new Date()).toISOString(),
    status: doc.status || 'idle'
  };
}

function savedObjectToConcreteTaskInstance(savedObject) {
  return { ...savedObject.attributes,
    id: savedObject.id,
    version: savedObject.version,
    scheduledAt: new Date(savedObject.attributes.scheduledAt),
    runAt: new Date(savedObject.attributes.runAt),
    startedAt: savedObject.attributes.startedAt ? new Date(savedObject.attributes.startedAt) : null,
    retryAt: savedObject.attributes.retryAt ? new Date(savedObject.attributes.retryAt) : null,
    state: parseJSONField(savedObject.attributes.state, 'state', savedObject.id),
    params: parseJSONField(savedObject.attributes.params, 'params', savedObject.id)
  };
}

function parseJSONField(json, fieldName, id) {
  try {
    return json ? JSON.parse(json) : {};
  } catch (error) {
    throw new Error(`Task "${id}"'s ${fieldName} field has invalid JSON: ${json}`);
  }
}

function ensureQueryOnlyReturnsTaskObjects(opts) {
  const originalQuery = opts.query;
  const queryOnlyTasks = {
    term: {
      type: 'task'
    }
  };
  const query = originalQuery ? {
    bool: {
      must: [queryOnlyTasks, originalQuery]
    }
  } : queryOnlyTasks;
  return { ...opts,
    query
  };
}

function ensureAggregationOnlyReturnsTaskObjects(opts) {
  const originalQuery = opts.query;
  const filterToOnlyTasks = {
    bool: {
      filter: [{
        term: {
          type: 'task'
        }
      }]
    }
  };
  const query = originalQuery ? {
    bool: {
      must: [filterToOnlyTasks, originalQuery]
    }
  } : filterToOnlyTasks;
  return { ...opts,
    query
  };
}

function isSavedObjectsUpdateResponse(result) {
  return result && typeof result.id === 'string';
}