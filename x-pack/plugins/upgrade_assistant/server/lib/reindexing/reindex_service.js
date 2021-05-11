"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWatcherIndex = exports.isMlIndex = exports.isSystemIndex = exports.reindexServiceFactory = void 0;

var _operators = require("rxjs/operators");

var _types = require("../../../common/types");

var _apm = require("../apm");

var _mapping = _interopRequireDefault(require("../apm/mapping.json"));

var _es_indices_state_check = require("../es_indices_state_check");

var _version = require("../version");

var _index_settings = require("./index_settings");

var _error = require("./error");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const VERSION_REGEX = new RegExp(/^([1-9]+)\.([0-9]+)\.([0-9]+)/);
const ML_INDICES = ['.ml-state', '.ml-anomalies', '.ml-config'];
const WATCHER_INDICES = ['.watches', '.triggered-watches'];

const reindexServiceFactory = (esClient, actions, log, licensing, apmIndexPatterns = []) => {
  // ------ Utility functions

  /**
   * If the index is a ML index that will cause jobs to fail when set to readonly,
   * turn on 'upgrade mode' to pause all ML jobs.
   * @param reindexOp
   */
  const stopMlJobs = async () => {
    await actions.incrementIndexGroupReindexes(_types.IndexGroup.ml);
    await actions.runWhileIndexGroupLocked(_types.IndexGroup.ml, async mlDoc => {
      await validateNodesMinimumVersion(6, 7);
      const {
        body
      } = await esClient.ml.setUpgradeMode({
        enabled: true
      });

      if (!body.acknowledged) {
        throw new Error(`Could not stop ML jobs`);
      }

      return mlDoc;
    });
  };
  /**
   * Resumes ML jobs if there are no more remaining reindex operations.
   */


  const resumeMlJobs = async () => {
    await actions.decrementIndexGroupReindexes(_types.IndexGroup.ml);
    await actions.runWhileIndexGroupLocked(_types.IndexGroup.ml, async mlDoc => {
      if (mlDoc.attributes.runningReindexCount === 0) {
        const {
          body
        } = await esClient.ml.setUpgradeMode({
          enabled: false
        });

        if (!body.acknowledged) {
          throw new Error(`Could not resume ML jobs`);
        }
      }

      return mlDoc;
    });
  };
  /**
   * Stops Watcher in Elasticsearch.
   */


  const stopWatcher = async () => {
    await actions.incrementIndexGroupReindexes(_types.IndexGroup.watcher);
    await actions.runWhileIndexGroupLocked(_types.IndexGroup.watcher, async watcherDoc => {
      const {
        body
      } = await esClient.watcher.stop();

      if (!body.acknowledged) {
        throw new Error('Could not stop Watcher');
      }

      return watcherDoc;
    });
  };
  /**
   * Starts Watcher in Elasticsearch.
   */


  const startWatcher = async () => {
    await actions.decrementIndexGroupReindexes(_types.IndexGroup.watcher);
    await actions.runWhileIndexGroupLocked(_types.IndexGroup.watcher, async watcherDoc => {
      if (watcherDoc.attributes.runningReindexCount === 0) {
        const {
          body
        } = await esClient.watcher.start();

        if (!body.acknowledged) {
          throw new Error('Could not start Watcher');
        }
      }

      return watcherDoc;
    });
  };

  const cleanupChanges = async reindexOp => {
    // Cancel reindex task if it was started but not completed
    if (reindexOp.attributes.lastCompletedStep === _types.ReindexStep.reindexStarted) {
      var _reindexOp$attributes;

      await esClient.tasks.cancel({
        task_id: (_reindexOp$attributes = reindexOp.attributes.reindexTaskId) !== null && _reindexOp$attributes !== void 0 ? _reindexOp$attributes : undefined
      }).catch(() => undefined); // Ignore any exceptions trying to cancel (it may have already completed).
    } // Set index back to writable if we ever got past this point.


    if (reindexOp.attributes.lastCompletedStep >= _types.ReindexStep.readonly) {
      await esClient.indices.putSettings({
        index: reindexOp.attributes.indexName,
        body: {
          'index.blocks.write': false
        }
      });
    }

    if (reindexOp.attributes.lastCompletedStep >= _types.ReindexStep.newIndexCreated && reindexOp.attributes.lastCompletedStep < _types.ReindexStep.aliasCreated) {
      await esClient.indices.delete({
        index: reindexOp.attributes.newIndexName
      });
    } // Resume consumers if we ever got past this point.


    if (reindexOp.attributes.lastCompletedStep >= _types.ReindexStep.indexGroupServicesStopped) {
      await resumeIndexGroupServices(reindexOp);
    }

    return reindexOp;
  }; // ------ Functions used to process the state machine


  const validateNodesMinimumVersion = async (minMajor, minMinor) => {
    const {
      body: nodesResponse
    } = await esClient.nodes.info();
    const outDatedNodes = Object.values(nodesResponse.nodes).filter(node => {
      const matches = node.version.match(VERSION_REGEX);
      const major = parseInt(matches[1], 10);
      const minor = parseInt(matches[2], 10); // All ES nodes must be >= 6.7.0 to pause ML jobs

      return !(major > minMajor || major === minMajor && minor >= minMinor);
    });

    if (outDatedNodes.length > 0) {
      const nodeList = JSON.stringify(outDatedNodes.map(n => n.name));
      throw new Error(`Some nodes are not on minimum version (${minMajor}.${minMinor}.0)  required: ${nodeList}`);
    }
  };

  const stopIndexGroupServices = async reindexOp => {
    if (isMlIndex(reindexOp.attributes.indexName)) {
      await stopMlJobs();
    } else if (isWatcherIndex(reindexOp.attributes.indexName)) {
      await stopWatcher();
    }

    return actions.updateReindexOp(reindexOp, {
      lastCompletedStep: _types.ReindexStep.indexGroupServicesStopped
    });
  };
  /**
   * Sets the original index as readonly so new data can be indexed until the reindex
   * is completed.
   * @param reindexOp
   */


  const setReadonly = async reindexOp => {
    const {
      indexName
    } = reindexOp.attributes;
    const {
      body: putReadonly
    } = await esClient.indices.putSettings({
      index: indexName,
      body: {
        'index.blocks.write': true
      }
    });

    if (!putReadonly.acknowledged) {
      throw new Error(`Index could not be set to readonly.`);
    }

    return actions.updateReindexOp(reindexOp, {
      lastCompletedStep: _types.ReindexStep.readonly
    });
  };
  /**
   * Creates a new index with the same mappings and settings as the original index.
   * @param reindexOp
   */


  const createNewIndex = async reindexOp => {
    const {
      indexName,
      newIndexName
    } = reindexOp.attributes;
    const flatSettings = await actions.getFlatSettings(indexName);

    if (!flatSettings) {
      throw _error.error.indexNotFound(`Index ${indexName} does not exist.`);
    }

    const {
      settings,
      mappings
    } = (0, _index_settings.transformFlatSettings)(flatSettings);
    const legacyApmIndex = (0, _apm.isLegacyApmIndex)(indexName, apmIndexPatterns, flatSettings.mappings);
    const {
      body: createIndex
    } = await esClient.indices.create({
      index: newIndexName,
      body: {
        settings,
        mappings: legacyApmIndex ? _mapping.default : mappings
      }
    });

    if (!createIndex.acknowledged) {
      throw _error.error.cannotCreateIndex(`Index could not be created: ${newIndexName}`);
    }

    return actions.updateReindexOp(reindexOp, {
      lastCompletedStep: _types.ReindexStep.newIndexCreated
    });
  };
  /**
   * Begins the reindex process via Elasticsearch's Reindex API.
   * @param reindexOp
   */


  const startReindexing = async reindexOp => {
    const {
      indexName,
      reindexOptions
    } = reindexOp.attributes; // Where possible, derive reindex options at the last moment before reindexing
    // to prevent them from becoming stale as they wait in the queue.

    const indicesState = await (0, _es_indices_state_check.esIndicesStateCheck)(esClient, [indexName]);
    const shouldOpenAndClose = indicesState[indexName] === 'closed';

    if (shouldOpenAndClose) {
      log.debug(`Detected closed index ${indexName}, opening...`);
      await esClient.indices.open({
        index: indexName
      });
    }

    const reindexBody = {
      source: {
        index: indexName
      },
      dest: {
        index: reindexOp.attributes.newIndexName
      }
    };
    const flatSettings = await actions.getFlatSettings(indexName);

    if (!flatSettings) {
      throw _error.error.indexNotFound(`Index ${indexName} does not exist.`);
    }

    const legacyApmIndex = (0, _apm.isLegacyApmIndex)(indexName, apmIndexPatterns, flatSettings.mappings);

    if (legacyApmIndex) {
      reindexBody.script = {
        lang: 'painless',
        source: _apm.apmReindexScript
      };
    }

    const {
      body: startReindexResponse
    } = await esClient.reindex({
      refresh: true,
      wait_for_completion: false,
      body: reindexBody
    });
    return actions.updateReindexOp(reindexOp, {
      lastCompletedStep: _types.ReindexStep.reindexStarted,
      reindexTaskId: startReindexResponse.task,
      reindexTaskPercComplete: 0,
      reindexOptions: { ...(reindexOptions !== null && reindexOptions !== void 0 ? reindexOptions : {}),
        // Indicate to downstream states whether we opened a closed index that should be
        // closed again.
        openAndClose: shouldOpenAndClose
      }
    });
  };
  /**
   * Polls Elasticsearch's Tasks API to see if the reindex operation has been completed.
   * @param reindexOp
   */


  const updateReindexStatus = async reindexOp => {
    const taskId = reindexOp.attributes.reindexTaskId; // Check reindexing task progress

    const {
      body: taskResponse
    } = await esClient.tasks.get({
      task_id: taskId,
      wait_for_completion: false
    });

    if (!taskResponse.completed) {
      // Updated the percent complete
      const perc = taskResponse.task.status.created / taskResponse.task.status.total;
      return actions.updateReindexOp(reindexOp, {
        reindexTaskPercComplete: perc
      });
    } else if (taskResponse.task.status.canceled === 'by user request') {
      // Set the status to cancelled
      reindexOp = await actions.updateReindexOp(reindexOp, {
        status: _types.ReindexStatus.cancelled
      }); // Do any other cleanup work necessary

      reindexOp = await cleanupChanges(reindexOp);
    } else {
      // Check that it reindexed all documents
      const {
        body: count
      } = await esClient.count({
        index: reindexOp.attributes.indexName
      });

      if (taskResponse.task.status.created < count) {
        // Include the entire task result in the error message. This should be guaranteed
        // to be JSON-serializable since it just came back from Elasticsearch.
        throw _error.error.reindexTaskFailed(`Reindexing failed: ${JSON.stringify(taskResponse)}`);
      } // Update the status


      reindexOp = await actions.updateReindexOp(reindexOp, {
        lastCompletedStep: _types.ReindexStep.reindexCompleted,
        reindexTaskPercComplete: 1
      });
    } // Delete the task from ES .tasks index


    const {
      body: deleteTaskResp
    } = await esClient.delete({
      index: '.tasks',
      type: 'task',
      id: taskId
    });

    if (deleteTaskResp.result !== 'deleted') {
      throw _error.error.reindexTaskCannotBeDeleted(`Could not delete reindexing task ${taskId}`);
    }

    return reindexOp;
  };
  /**
   * Creates an alias that points the old index to the new index, deletes the old index.
   * @param reindexOp
   */


  const switchAlias = async reindexOp => {
    const {
      indexName,
      newIndexName,
      reindexOptions
    } = reindexOp.attributes;
    const {
      body: response
    } = await esClient.indices.getAlias({
      index: indexName
    });
    const existingAliases = response[indexName].aliases;
    const extraAliases = Object.keys(existingAliases).map(aliasName => ({
      add: {
        index: newIndexName,
        alias: aliasName,
        ...existingAliases[aliasName]
      }
    }));
    const {
      body: aliasResponse
    } = await esClient.indices.updateAliases({
      body: {
        actions: [{
          add: {
            index: newIndexName,
            alias: indexName
          }
        }, {
          remove_index: {
            index: indexName
          }
        }, ...extraAliases]
      }
    });

    if (!aliasResponse.acknowledged) {
      throw _error.error.cannotCreateIndex(`Index aliases could not be created.`);
    }

    if ((reindexOptions === null || reindexOptions === void 0 ? void 0 : reindexOptions.openAndClose) === true) {
      await esClient.indices.close({
        index: indexName
      });
    }

    return actions.updateReindexOp(reindexOp, {
      lastCompletedStep: _types.ReindexStep.aliasCreated
    });
  };

  const resumeIndexGroupServices = async reindexOp => {
    if (isMlIndex(reindexOp.attributes.indexName)) {
      await resumeMlJobs();
    } else if (isWatcherIndex(reindexOp.attributes.indexName)) {
      await startWatcher();
    } // Only change the status if we're still in-progress (this function is also called when the reindex fails or is cancelled)


    if (reindexOp.attributes.status === _types.ReindexStatus.inProgress) {
      return actions.updateReindexOp(reindexOp, {
        lastCompletedStep: _types.ReindexStep.indexGroupServicesStarted
      });
    } else {
      return reindexOp;
    }
  }; // ------ The service itself


  return {
    async hasRequiredPrivileges(indexName) {
      /**
       * To avoid a circular dependency on Security we use a work around
       * here to detect whether Security is available and enabled
       * (i.e., via the licensing plugin). This enables Security to use
       * functionality exposed through Upgrade Assistant.
       */
      const license = await licensing.license$.pipe((0, _operators.first)()).toPromise();
      const securityFeature = license.getFeature('security'); // If security is disabled or unavailable, return true.

      if (!securityFeature || !(securityFeature.isAvailable && securityFeature.isEnabled)) {
        return true;
      }

      const names = [indexName, (0, _index_settings.generateNewIndexName)(indexName)];
      const sourceName = (0, _index_settings.sourceNameForIndex)(indexName); // if we have re-indexed this in the past, there will be an
      // underlying alias we will also need to update.

      if (sourceName !== indexName) {
        names.push(sourceName);
      } // Otherwise, query for required privileges for this index.


      const body = {
        cluster: ['manage'],
        index: [{
          names,
          allow_restricted_indices: true,
          privileges: ['all']
        }, {
          names: ['.tasks'],
          privileges: ['read', 'delete']
        }]
      };

      if (isMlIndex(indexName)) {
        body.cluster = [...body.cluster, 'manage_ml'];
      }

      if (isWatcherIndex(indexName)) {
        body.cluster = [...body.cluster, 'manage_watcher'];
      }

      const {
        body: resp
      } = await esClient.security.hasPrivileges({
        body
      });
      return resp.has_all_requested;
    },

    async detectReindexWarnings(indexName) {
      const flatSettings = await actions.getFlatSettingsWithTypeName(indexName);

      if (!flatSettings) {
        return null;
      } else {
        return (0, _index_settings.getReindexWarnings)(flatSettings, apmIndexPatterns);
      }
    },

    getIndexGroup(indexName) {
      if (isMlIndex(indexName)) {
        return _types.IndexGroup.ml;
      } else if (isWatcherIndex(indexName)) {
        return _types.IndexGroup.watcher;
      }
    },

    async createReindexOperation(indexName, opts) {
      if (isSystemIndex(indexName)) {
        throw _error.error.reindexSystemIndex(`Reindexing system indices are not yet supported within this major version. Upgrade to the latest ${_version.versionService.getMajorVersion()}.x minor version.`);
      }

      const {
        body: indexExists
      } = await esClient.indices.exists({
        index: indexName
      });

      if (!indexExists) {
        throw _error.error.indexNotFound(`Index ${indexName} does not exist in this cluster.`);
      }

      const existingReindexOps = await actions.findReindexOperations(indexName);

      if (existingReindexOps.total !== 0) {
        const existingOp = existingReindexOps.saved_objects[0];

        if (existingOp.attributes.status === _types.ReindexStatus.failed || existingOp.attributes.status === _types.ReindexStatus.cancelled) {
          // Delete the existing one if it failed or was cancelled to give a chance to retry.
          await actions.deleteReindexOp(existingOp);
        } else {
          throw _error.error.reindexAlreadyInProgress(`A reindex operation already in-progress for ${indexName}`);
        }
      }

      return actions.createReindexOp(indexName, opts !== null && opts !== void 0 && opts.enqueue ? {
        queueSettings: {
          queuedAt: Date.now()
        }
      } : undefined);
    },

    async findReindexOperation(indexName) {
      const findResponse = await actions.findReindexOperations(indexName); // Bail early if it does not exist or there is more than one.

      if (findResponse.total === 0) {
        return null;
      } else if (findResponse.total > 1) {
        throw _error.error.multipleReindexJobsFound(`More than one reindex operation found for ${indexName}`);
      }

      return findResponse.saved_objects[0];
    },

    async cleanupReindexOperations(indexNames) {
      const performCleanup = async indexName => {
        const existingReindexOps = await actions.findReindexOperations(indexName);

        if (existingReindexOps && existingReindexOps.total !== 0) {
          const existingOp = existingReindexOps.saved_objects[0];

          if (existingOp.attributes.status === _types.ReindexStatus.completed) {
            // Delete the existing one if its status is completed, but still contains deprecation warnings
            // example scenario: index was upgraded, but then deleted and restored with an old snapshot
            await actions.deleteReindexOp(existingOp);
          }
        }
      };

      await Promise.all(indexNames.map(performCleanup));
    },

    findAllByStatus: actions.findAllByStatus,

    async processNextStep(reindexOp) {
      return actions.runWhileLocked(reindexOp, async lockedReindexOp => {
        try {
          switch (lockedReindexOp.attributes.lastCompletedStep) {
            case _types.ReindexStep.created:
              lockedReindexOp = await stopIndexGroupServices(lockedReindexOp);
              break;

            case _types.ReindexStep.indexGroupServicesStopped:
              lockedReindexOp = await setReadonly(lockedReindexOp);
              break;

            case _types.ReindexStep.readonly:
              lockedReindexOp = await createNewIndex(lockedReindexOp);
              break;

            case _types.ReindexStep.newIndexCreated:
              lockedReindexOp = await startReindexing(lockedReindexOp);
              break;

            case _types.ReindexStep.reindexStarted:
              lockedReindexOp = await updateReindexStatus(lockedReindexOp);
              break;

            case _types.ReindexStep.reindexCompleted:
              lockedReindexOp = await switchAlias(lockedReindexOp);
              break;

            case _types.ReindexStep.aliasCreated:
              lockedReindexOp = await resumeIndexGroupServices(lockedReindexOp);
              break;

            case _types.ReindexStep.indexGroupServicesStarted:
              lockedReindexOp = await actions.updateReindexOp(lockedReindexOp, {
                status: _types.ReindexStatus.completed
              });

            default:
              break;
          }
        } catch (e) {
          log.error(`Reindexing step failed: ${e instanceof Error ? e.stack : e.toString()}`); // Trap the exception and add the message to the object so the UI can display it.

          lockedReindexOp = await actions.updateReindexOp(lockedReindexOp, {
            status: _types.ReindexStatus.failed,
            errorMessage: e.toString()
          }); // Cleanup any changes, ignoring any errors.

          lockedReindexOp = await cleanupChanges(lockedReindexOp).catch(err => lockedReindexOp);
        }

        return lockedReindexOp;
      });
    },

    async pauseReindexOperation(indexName) {
      const reindexOp = await this.findReindexOperation(indexName);

      if (!reindexOp) {
        throw new Error(`No reindex operation found for index ${indexName}`);
      }

      return actions.runWhileLocked(reindexOp, async op => {
        if (op.attributes.status === _types.ReindexStatus.paused) {
          // Another node already paused the operation, don't do anything
          return reindexOp;
        } else if (op.attributes.status !== _types.ReindexStatus.inProgress) {
          throw new Error(`Reindex operation must be inProgress in order to be paused.`);
        }

        return actions.updateReindexOp(op, {
          status: _types.ReindexStatus.paused
        });
      });
    },

    async resumeReindexOperation(indexName, opts) {
      const reindexOp = await this.findReindexOperation(indexName);

      if (!reindexOp) {
        throw new Error(`No reindex operation found for index ${indexName}`);
      }

      return actions.runWhileLocked(reindexOp, async op => {
        if (op.attributes.status === _types.ReindexStatus.inProgress) {
          // Another node already resumed the operation, don't do anything
          return reindexOp;
        } else if (op.attributes.status !== _types.ReindexStatus.paused) {
          throw new Error(`Reindex operation must be paused in order to be resumed.`);
        }

        const queueSettings = opts !== null && opts !== void 0 && opts.enqueue ? {
          queuedAt: Date.now()
        } : undefined;
        return actions.updateReindexOp(op, {
          status: _types.ReindexStatus.inProgress,
          reindexOptions: queueSettings ? {
            queueSettings
          } : undefined
        });
      });
    },

    async startQueuedReindexOperation(indexName) {
      var _reindexOp$attributes2;

      const reindexOp = await this.findReindexOperation(indexName);

      if (!reindexOp) {
        throw _error.error.indexNotFound(`No reindex operation found for index ${indexName}`);
      }

      if (!((_reindexOp$attributes2 = reindexOp.attributes.reindexOptions) !== null && _reindexOp$attributes2 !== void 0 && _reindexOp$attributes2.queueSettings)) {
        throw _error.error.reindexIsNotInQueue(`Reindex operation ${indexName} is not in the queue.`);
      }

      return actions.runWhileLocked(reindexOp, async lockedReindexOp => {
        const {
          reindexOptions
        } = lockedReindexOp.attributes;
        reindexOptions.queueSettings.startedAt = Date.now();
        return actions.updateReindexOp(lockedReindexOp, {
          reindexOptions
        });
      });
    },

    async cancelReindexing(indexName) {
      const reindexOp = await this.findReindexOperation(indexName);

      if (!reindexOp) {
        throw _error.error.indexNotFound(`No reindex operation found for index ${indexName}`);
      } else if (reindexOp.attributes.status !== _types.ReindexStatus.inProgress) {
        throw _error.error.reindexCannotBeCancelled(`Reindex operation is not in progress`);
      } else if (reindexOp.attributes.lastCompletedStep !== _types.ReindexStep.reindexStarted) {
        throw _error.error.reindexCannotBeCancelled(`Reindex operation is not currently waiting for reindex task to complete`);
      }

      const {
        body: resp
      } = await esClient.tasks.cancel({
        task_id: reindexOp.attributes.reindexTaskId
      });

      if (resp.node_failures && resp.node_failures.length > 0) {
        throw _error.error.reindexCannotBeCancelled(`Could not cancel reindex.`);
      }

      return reindexOp;
    }

  };
};

exports.reindexServiceFactory = reindexServiceFactory;

const isSystemIndex = indexName => indexName.startsWith('.');

exports.isSystemIndex = isSystemIndex;

const isMlIndex = indexName => {
  const sourceName = (0, _index_settings.sourceNameForIndex)(indexName);
  return ML_INDICES.indexOf(sourceName) >= 0;
};

exports.isMlIndex = isMlIndex;

const isWatcherIndex = indexName => {
  const sourceName = (0, _index_settings.sourceNameForIndex)(indexName);
  return WATCHER_INDICES.indexOf(sourceName) >= 0;
};

exports.isWatcherIndex = isWatcherIndex;