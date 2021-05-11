"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskClaiming = void 0;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _Option = require("fp-ts/lib/Option");

var _result_type = require("../lib/result_type");

var _task = require("../task");

var _task_events = require("../task_events");

var _query_clauses = require("./query_clauses");

var _mark_available_tasks_as_claimed = require("./mark_available_tasks_as_claimed");

var _task_store = require("../task_store");

var _fill_pool = require("../lib/fill_pool");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

var BatchConcurrency;

(function (BatchConcurrency) {
  BatchConcurrency[BatchConcurrency["Unlimited"] = 0] = "Unlimited";
  BatchConcurrency[BatchConcurrency["Limited"] = 1] = "Limited";
})(BatchConcurrency || (BatchConcurrency = {}));

class TaskClaiming {
  /**
   * Constructs a new TaskStore.
   * @param {TaskClaimingOpts} opts
   * @prop {number} maxAttempts - The maximum number of attempts before a task will be abandoned
   * @prop {TaskDefinition} definition - The definition of the task being run
   */
  constructor(opts) {
    _defineProperty(this, "errors$", new _rxjs.Subject());

    _defineProperty(this, "maxAttempts", void 0);

    _defineProperty(this, "definitions", void 0);

    _defineProperty(this, "events$", void 0);

    _defineProperty(this, "taskStore", void 0);

    _defineProperty(this, "getCapacity", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "taskClaimingBatchesByType", void 0);

    _defineProperty(this, "taskMaxAttempts", void 0);

    _defineProperty(this, "claimingBatchIndex", 0);

    _defineProperty(this, "emitEvents", events => {
      events.forEach(event => this.events$.next(event));
    });

    _defineProperty(this, "executClaimAvailableTasks", async ({
      claimOwnershipUntil,
      claimTasksById = [],
      size,
      taskTypes
    }) => {
      const claimTasksByIdWithRawIds = this.taskStore.convertToSavedObjectIds(claimTasksById);
      const {
        updated: tasksUpdated,
        version_conflicts: tasksConflicted
      } = await this.markAvailableTasksAsClaimed({
        claimOwnershipUntil,
        claimTasksById: claimTasksByIdWithRawIds,
        size,
        taskTypes
      });
      const docs = tasksUpdated > 0 ? await this.sweepForClaimedTasks(claimTasksByIdWithRawIds, taskTypes, size) : [];
      const [documentsReturnedById, documentsClaimedBySchedule] = (0, _lodash.partition)(docs, doc => claimTasksById.includes(doc.id));
      const [documentsClaimedById, documentsRequestedButNotClaimed] = (0, _lodash.partition)(documentsReturnedById, // we filter the schduled tasks down by status is 'claiming' in the esearch,
      // but we do not apply this limitation on tasks claimed by ID so that we can
      // provide more detailed error messages when we fail to claim them
      doc => doc.status === _task.TaskStatus.Claiming); // count how many tasks we've claimed by ID and validate we have capacity for them to run

      const remainingCapacityOfClaimByIdByType = (0, _lodash.mapValues)( // This means we take the tasks that were claimed by their ID and count them by their type
      (0, _lodash.countBy)(documentsClaimedById, doc => doc.taskType), (count, type) => this.getCapacity(type) - count);
      const [documentsClaimedByIdWithinCapacity, documentsClaimedByIdOutOfCapacity] = (0, _lodash.partition)(documentsClaimedById, doc => {
        // if we've exceeded capacity, we reject this task
        if (remainingCapacityOfClaimByIdByType[doc.taskType] < 0) {
          // as we're rejecting this task we can inc the count so that we know
          // to keep the next one returned by ID of the same type
          remainingCapacityOfClaimByIdByType[doc.taskType]++;
          return false;
        }

        return true;
      });
      const documentsRequestedButNotReturned = (0, _lodash.difference)(claimTasksById, documentsReturnedById.map(doc => doc.id));
      this.emitEvents([...documentsClaimedByIdWithinCapacity.map(doc => (0, _task_events.asTaskClaimEvent)(doc.id, (0, _result_type.asOk)(doc))), ...documentsClaimedByIdOutOfCapacity.map(doc => (0, _task_events.asTaskClaimEvent)(doc.id, (0, _result_type.asErr)({
        task: (0, _Option.some)(doc),
        errorType: _task_events.TaskClaimErrorType.CLAIMED_BY_ID_OUT_OF_CAPACITY
      }))), ...documentsClaimedBySchedule.map(doc => (0, _task_events.asTaskClaimEvent)(doc.id, (0, _result_type.asOk)(doc))), ...documentsRequestedButNotClaimed.map(doc => (0, _task_events.asTaskClaimEvent)(doc.id, (0, _result_type.asErr)({
        task: (0, _Option.some)(doc),
        errorType: _task_events.TaskClaimErrorType.CLAIMED_BY_ID_NOT_IN_CLAIMING_STATUS
      }))), ...documentsRequestedButNotReturned.map(id => (0, _task_events.asTaskClaimEvent)(id, (0, _result_type.asErr)({
        task: _Option.none,
        errorType: _task_events.TaskClaimErrorType.CLAIMED_BY_ID_NOT_RETURNED
      })))]);
      const stats = {
        tasksUpdated,
        tasksConflicted,
        tasksRejected: documentsClaimedByIdOutOfCapacity.length,
        tasksClaimed: documentsClaimedByIdWithinCapacity.length + documentsClaimedBySchedule.length
      };

      if (docs.length !== stats.tasksClaimed + stats.tasksRejected) {
        this.logger.warn(`[Task Ownership error]: ${stats.tasksClaimed} tasks were claimed by Kibana, but ${docs.length} task(s) were fetched (${docs.map(doc => doc.id).join(', ')})`);
      }

      return {
        stats,
        docs: [...documentsClaimedByIdWithinCapacity, ...documentsClaimedBySchedule]
      };
    });

    this.definitions = opts.definitions;
    this.maxAttempts = opts.maxAttempts;
    this.taskStore = opts.taskStore;
    this.getCapacity = opts.getCapacity;
    this.logger = opts.logger;
    this.taskClaimingBatchesByType = this.partitionIntoClaimingBatches(this.definitions);
    this.taskMaxAttempts = Object.fromEntries(this.normalizeMaxAttempts(this.definitions));
    this.events$ = new _rxjs.Subject();
  }

  partitionIntoClaimingBatches(definitions) {
    const {
      limitedConcurrency,
      unlimitedConcurrency,
      skippedTypes
    } = (0, _lodash.groupBy)(definitions.getAllDefinitions(), definition => definition.maxConcurrency ? 'limitedConcurrency' : definition.maxConcurrency === 0 ? 'skippedTypes' : 'unlimitedConcurrency');

    if (skippedTypes !== null && skippedTypes !== void 0 && skippedTypes.length) {
      this.logger.info(`Task Manager will never claim tasks of the following types as their "maxConcurrency" is set to 0: ${skippedTypes.map(({
        type
      }) => type).join(', ')}`);
    }

    return [...(unlimitedConcurrency ? [asUnlimited(new Set(unlimitedConcurrency.map(({
      type
    }) => type)))] : []), ...(limitedConcurrency ? limitedConcurrency.map(({
      type
    }) => asLimited(type)) : [])];
  }

  normalizeMaxAttempts(definitions) {
    return new Map([...definitions].map(([type, {
      maxAttempts
    }]) => [type, maxAttempts || this.maxAttempts]));
  }

  getClaimingBatches() {
    // return all batches, starting at index and cycling back to where we began
    const batch = [...this.taskClaimingBatchesByType.slice(this.claimingBatchIndex), ...this.taskClaimingBatchesByType.slice(0, this.claimingBatchIndex)]; // shift claimingBatchIndex by one so that next cycle begins at the next index

    this.claimingBatchIndex = (this.claimingBatchIndex + 1) % this.taskClaimingBatchesByType.length;
    return batch;
  }

  get events() {
    return this.events$;
  }

  claimAvailableTasksIfCapacityIsAvailable(claimingOptions) {
    if (this.getCapacity()) {
      return this.claimAvailableTasks(claimingOptions).pipe((0, _operators.map)(claimResult => (0, _result_type.asOk)(claimResult)));
    }

    this.logger.debug(`[Task Ownership]: Task Manager has skipped Claiming Ownership of available tasks at it has ran out Available Workers.`);
    return (0, _rxjs.of)((0, _result_type.asErr)(_fill_pool.FillPoolResult.NoAvailableWorkers));
  }

  claimAvailableTasks({
    claimOwnershipUntil,
    claimTasksById = []
  }) {
    const initialCapacity = this.getCapacity();
    return (0, _rxjs.from)(this.getClaimingBatches()).pipe((0, _operators.mergeScan)((accumulatedResult, batch) => {
      const stopTaskTimer = (0, _task_events.startTaskTimer)();
      const capacity = Math.min(initialCapacity - accumulatedResult.stats.tasksClaimed, isLimited(batch) ? this.getCapacity(batch.tasksTypes) : this.getCapacity()); // if we have no more capacity, short circuit here

      if (capacity <= 0) {
        return (0, _rxjs.of)(accumulatedResult);
      }

      return (0, _rxjs.from)(this.executClaimAvailableTasks({
        claimOwnershipUntil,
        claimTasksById: claimTasksById.splice(0, capacity),
        size: capacity,
        taskTypes: isLimited(batch) ? new Set([batch.tasksTypes]) : batch.tasksTypes
      }).then(result => {
        const {
          stats,
          docs
        } = accumulateClaimOwnershipResults(accumulatedResult, result);
        stats.tasksConflicted = (0, _task_store.correctVersionConflictsForContinuation)(stats.tasksClaimed, stats.tasksConflicted, initialCapacity);
        return {
          stats,
          docs,
          timing: stopTaskTimer()
        };
      }));
    }, // initialise the accumulation with no results
    accumulateClaimOwnershipResults(), // only run one batch at a time
    1));
  }

  async markAvailableTasksAsClaimed({
    claimOwnershipUntil,
    claimTasksById,
    size,
    taskTypes
  }) {
    const {
      taskTypesToSkip = [],
      taskTypesToClaim = []
    } = (0, _lodash.groupBy)(this.definitions.getAllTypes(), type => taskTypes.has(type) ? 'taskTypesToClaim' : 'taskTypesToSkip');
    const queryForScheduledTasks = (0, _query_clauses.mustBeAllOf)( // Either a task with idle status and runAt <= now or
    // status running or claiming with a retryAt <= now.
    (0, _query_clauses.shouldBeOneOf)(_mark_available_tasks_as_claimed.IdleTaskWithExpiredRunAt, _mark_available_tasks_as_claimed.RunningOrClaimingTaskWithExpiredRetryAt)); // The documents should be sorted by runAt/retryAt, unless there are pinned
    // tasks being queried, in which case we want to sort by score first, and then
    // the runAt/retryAt.  That way we'll get the pinned tasks first.  Note that
    // the score seems to favor newer documents rather than older documents, so
    // if there are not pinned tasks being queried, we do NOT want to sort by score
    // at all, just by runAt/retryAt.

    const sort = [_mark_available_tasks_as_claimed.SortByRunAtAndRetryAt];

    if (claimTasksById && claimTasksById.length) {
      sort.unshift('_score');
    }

    const apmTrans = _elasticApmNode.default.startTransaction(`taskManager markAvailableTasksAsClaimed`, 'taskManager');

    const result = await this.taskStore.updateByQuery((0, _query_clauses.asUpdateByQuery)({
      query: (0, _query_clauses.matchesClauses)(claimTasksById && claimTasksById.length ? (0, _query_clauses.mustBeAllOf)((0, _query_clauses.asPinnedQuery)(claimTasksById, queryForScheduledTasks)) : queryForScheduledTasks, (0, _query_clauses.filterDownBy)(_mark_available_tasks_as_claimed.InactiveTasks)),
      update: (0, _mark_available_tasks_as_claimed.updateFieldsAndMarkAsFailed)({
        ownerId: this.taskStore.taskManagerId,
        retryAt: claimOwnershipUntil
      }, claimTasksById || [], taskTypesToClaim, taskTypesToSkip, (0, _lodash.pick)(this.taskMaxAttempts, taskTypesToClaim)),
      sort
    }), {
      max_docs: size
    });
    if (apmTrans) apmTrans.end();
    return result;
  }
  /**
   * Fetches tasks from the index, which are owned by the current Kibana instance
   */


  async sweepForClaimedTasks(claimTasksById, taskTypes, size) {
    const claimedTasksQuery = (0, _mark_available_tasks_as_claimed.tasksClaimedByOwner)(this.taskStore.taskManagerId, (0, _mark_available_tasks_as_claimed.tasksOfType)([...taskTypes]));
    const {
      docs
    } = await this.taskStore.fetch({
      query: claimTasksById && claimTasksById.length ? (0, _query_clauses.asPinnedQuery)(claimTasksById, claimedTasksQuery) : claimedTasksQuery,
      size,
      sort: _mark_available_tasks_as_claimed.SortByRunAtAndRetryAt,
      seq_no_primary_term: true
    });
    return docs;
  }

}

exports.TaskClaiming = TaskClaiming;

const emptyClaimOwnershipResult = () => {
  return {
    stats: {
      tasksUpdated: 0,
      tasksConflicted: 0,
      tasksClaimed: 0,
      tasksRejected: 0
    },
    docs: []
  };
};

function accumulateClaimOwnershipResults(prev = emptyClaimOwnershipResult(), next) {
  if (next) {
    const {
      stats,
      docs,
      timing
    } = next;
    const res = {
      stats: {
        tasksUpdated: stats.tasksUpdated + prev.stats.tasksUpdated,
        tasksConflicted: stats.tasksConflicted + prev.stats.tasksConflicted,
        tasksClaimed: stats.tasksClaimed + prev.stats.tasksClaimed,
        tasksRejected: stats.tasksRejected + prev.stats.tasksRejected
      },
      docs,
      timing
    };
    return res;
  }

  return prev;
}

function isLimited(batch) {
  return batch.concurrency === BatchConcurrency.Limited;
}

function asLimited(tasksType) {
  return {
    concurrency: BatchConcurrency.Limited,
    tasksTypes: tasksType
  };
}

function asUnlimited(tasksTypes) {
  return {
    concurrency: BatchConcurrency.Unlimited,
    tasksTypes
  };
}