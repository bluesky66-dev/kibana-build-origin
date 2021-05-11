"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskManagerRunner = exports.TaskRunResult = exports.TaskRunningStage = void 0;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _perf_hooks = require("perf_hooks");

var _lodash = require("lodash");

var _server = require("../../../../../src/core/server");

var _result_type = require("../lib/result_type");

var _task_events = require("../task_events");

var _intervals = require("../lib/intervals");

var _task = require("../task");

var _errors = require("./errors");

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

const defaultBackoffPerFailure = 5 * 60 * 1000;
const EMPTY_RUN_RESULT = {
  state: {}
};
let TaskRunningStage;
exports.TaskRunningStage = TaskRunningStage;

(function (TaskRunningStage) {
  TaskRunningStage["PENDING"] = "PENDING";
  TaskRunningStage["READY_TO_RUN"] = "READY_TO_RUN";
  TaskRunningStage["RAN"] = "RAN";
})(TaskRunningStage || (exports.TaskRunningStage = TaskRunningStage = {}));

let TaskRunResult; // A ConcreteTaskInstance which we *know* has a `startedAt` Date on it

exports.TaskRunResult = TaskRunResult;

(function (TaskRunResult) {
  TaskRunResult["Success"] = "Success";
  TaskRunResult["SuccessRescheduled"] = "Success";
  TaskRunResult["RetryScheduled"] = "RetryScheduled";
  TaskRunResult["Failed"] = "Failed";
})(TaskRunResult || (exports.TaskRunResult = TaskRunResult = {}));
/**
 * Runs a background task, ensures that errors are properly handled,
 * allows for cancellation.
 *
 * @export
 * @class TaskManagerRunner
 * @implements {TaskRunner}
 */


class TaskManagerRunner {
  /**
   * Creates an instance of TaskManagerRunner.
   * @param {Opts} opts
   * @prop {Logger} logger - The task manager logger
   * @prop {TaskDefinition} definition - The definition of the task being run
   * @prop {ConcreteTaskInstance} instance - The record describing this particular task instance
   * @prop {Updatable} store - The store used to read / write tasks instance info
   * @prop {BeforeRunFunction} beforeRun - A function that adjusts the run context prior to running the task
   * @memberof TaskManagerRunner
   */
  constructor({
    instance,
    definitions,
    logger,
    store,
    beforeRun,
    beforeMarkRunning,
    defaultMaxAttempts,
    onTaskEvent = _lodash.identity
  }) {
    _defineProperty(this, "task", void 0);

    _defineProperty(this, "instance", void 0);

    _defineProperty(this, "definitions", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "bufferedTaskStore", void 0);

    _defineProperty(this, "beforeRun", void 0);

    _defineProperty(this, "beforeMarkRunning", void 0);

    _defineProperty(this, "onTaskEvent", void 0);

    _defineProperty(this, "defaultMaxAttempts", void 0);

    _defineProperty(this, "rescheduleFailedRun", failureResult => {
      const {
        state,
        error
      } = failureResult;

      if (this.shouldTryToScheduleRetry() && !(0, _errors.isUnrecoverableError)(error)) {
        // if we're retrying, keep the number of attempts
        const {
          schedule,
          attempts
        } = this.instance.task;
        const reschedule = failureResult.runAt ? {
          runAt: failureResult.runAt
        } : failureResult.schedule ? {
          schedule: failureResult.schedule
        } : schedule ? {
          schedule
        } : // when result.error is truthy, then we're retrying because it failed
        {
          runAt: this.getRetryDelay({
            attempts,
            error
          })
        };

        if (reschedule.runAt || reschedule.schedule) {
          return (0, _result_type.asOk)({
            state,
            attempts,
            ...reschedule
          });
        }
      } // scheduling a retry isn't possible,mark task as failed


      return (0, _result_type.asErr)({
        status: _task.TaskStatus.Failed
      });
    });

    this.instance = asPending(sanitizeInstance(instance));
    this.definitions = definitions;
    this.logger = logger;
    this.bufferedTaskStore = store;
    this.beforeRun = beforeRun;
    this.beforeMarkRunning = beforeMarkRunning;
    this.onTaskEvent = onTaskEvent;
    this.defaultMaxAttempts = defaultMaxAttempts;
  }
  /**
   * Gets the id of this task instance.
   */


  get id() {
    return this.instance.task.id;
  }
  /**
   * Gets the task type of this task instance.
   */


  get taskType() {
    return this.instance.task.taskType;
  }
  /**
   * Get the stage this TaskRunner is at
   */


  get stage() {
    return this.instance.stage;
  }
  /**
   * Gets the task defintion from the dictionary.
   */


  get definition() {
    return this.definitions.get(this.taskType);
  }
  /**
   * Gets the time at which this task will expire.
   */


  get expiration() {
    return (0, _intervals.intervalFromDate)( // if the task is running, use it's started at, otherwise use the timestamp at
    // which it was last updated
    // this allows us to catch tasks that remain in Pending/Finalizing without being
    // cleaned up
    isReadyToRun(this.instance) ? this.instance.task.startedAt : this.instance.timestamp, this.definition.timeout);
  }
  /**
   * Gets the duration of the current task run
   */


  get startedAt() {
    return this.instance.task.startedAt;
  }
  /**
   * Gets whether or not this task has run longer than its expiration setting allows.
   */


  get isExpired() {
    return this.expiration < new Date();
  }
  /**
   * Returns a log-friendly representation of this task.
   */


  toString() {
    return `${this.taskType} "${this.id}"`;
  }
  /**
   * Runs the task, handling the task result, errors, etc, rescheduling if need
   * be. NOTE: the time of applying the middleware's beforeRun is incorporated
   * into the total timeout time the task in configured with. We may decide to
   * start the timer after beforeRun resolves
   *
   * @returns {Promise<Result<SuccessfulRunResult, FailedRunResult>>}
   */


  async run() {
    if (!isReadyToRun(this.instance)) {
      throw new Error(`Running task ${this} failed as it ${isPending(this.instance) ? `isn't ready to be ran` : `has already been ran`}`);
    }

    this.logger.debug(`Running task ${this}`);
    const modifiedContext = await this.beforeRun({
      taskInstance: this.instance.task
    });
    const stopTaskTimer = (0, _task_events.startTaskTimer)();

    const apmTrans = _elasticApmNode.default.startTransaction(`taskManager run`, 'taskManager');

    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.addLabels({
      taskType: this.taskType
    });

    try {
      this.task = this.definition.createTaskRunner(modifiedContext);
      const result = await this.task.run();
      const validatedResult = this.validateResult(result);
      if (apmTrans) apmTrans.end('success');
      return this.processResult(validatedResult, stopTaskTimer());
    } catch (err) {
      this.logger.error(`Task ${this} failed: ${err}`); // in error scenario, we can not get the RunResult
      // re-use modifiedContext's state, which is correct as of beforeRun

      if (apmTrans) apmTrans.end('error');
      return this.processResult((0, _result_type.asErr)({
        error: err,
        state: modifiedContext.taskInstance.state
      }), stopTaskTimer());
    }
  }
  /**
   * Attempts to claim exclusive rights to run the task. If the attempt fails
   * with a 409 (http conflict), we assume another Kibana instance beat us to the punch.
   *
   * @returns {Promise<boolean>}
   */


  async markTaskAsRunning() {
    if (!isPending(this.instance)) {
      throw new Error(`Marking task ${this} as running has failed as it ${isReadyToRun(this.instance) ? `is already running` : `has already been ran`}`);
    }

    _perf_hooks.performance.mark('markTaskAsRunning_start');

    const apmTrans = _elasticApmNode.default.startTransaction(`taskManager markTaskAsRunning`, 'taskManager');

    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.addLabels({
      taskType: this.taskType
    });
    const now = new Date();

    try {
      var _ref;

      const {
        taskInstance
      } = await this.beforeMarkRunning({
        taskInstance: this.instance.task
      });
      const attempts = taskInstance.attempts + 1;
      const ownershipClaimedUntil = taskInstance.retryAt;
      const {
        id
      } = taskInstance;
      const timeUntilClaimExpires = howManyMsUntilOwnershipClaimExpires(ownershipClaimedUntil);

      if (timeUntilClaimExpires < 0) {
        this.logger.debug(`[Task Runner] Task ${id} started after ownership expired (${Math.abs(timeUntilClaimExpires)}ms after expiry)`);
      }

      this.instance = asReadyToRun(await this.bufferedTaskStore.update({ ...taskInstance,
        status: _task.TaskStatus.Running,
        startedAt: now,
        attempts,
        retryAt: (_ref = this.instance.task.schedule ? (0, _intervals.maxIntervalFromDate)(now, this.instance.task.schedule.interval, this.definition.timeout) : this.getRetryDelay({
          attempts,
          // Fake an error. This allows retry logic when tasks keep timing out
          // and lets us set a proper "retryAt" value each time.
          error: new Error('Task timeout'),
          addDuration: this.definition.timeout
        })) !== null && _ref !== void 0 ? _ref : null // This is a safe convertion as we're setting the startAt above

      }));
      const timeUntilClaimExpiresAfterUpdate = howManyMsUntilOwnershipClaimExpires(ownershipClaimedUntil);

      if (timeUntilClaimExpiresAfterUpdate < 0) {
        this.logger.debug(`[Task Runner] Task ${id} ran after ownership expired (${Math.abs(timeUntilClaimExpiresAfterUpdate)}ms after expiry)`);
      }

      if (apmTrans) apmTrans.end('success');
      performanceStopMarkingTaskAsRunning();
      this.onTaskEvent((0, _task_events.asTaskMarkRunningEvent)(this.id, (0, _result_type.asOk)(this.instance.task)));
      return true;
    } catch (error) {
      if (apmTrans) apmTrans.end('failure');
      performanceStopMarkingTaskAsRunning();
      this.onTaskEvent((0, _task_events.asTaskMarkRunningEvent)(this.id, (0, _result_type.asErr)(error)));

      if (!_server.SavedObjectsErrorHelpers.isConflictError(error)) {
        if (!_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
          // try to release claim as an unknown failure prevented us from marking as running
          (0, _result_type.mapErr)(errReleaseClaim => {
            this.logger.error(`[Task Runner] Task ${this.id} failed to release claim after failure: ${errReleaseClaim}`);
          }, await this.releaseClaimAndIncrementAttempts());
        }

        throw error;
      }
    }

    return false;
  }
  /**
   * Attempts to cancel the task.
   *
   * @returns {Promise<void>}
   */


  async cancel() {
    const {
      task
    } = this;

    if (task !== null && task !== void 0 && task.cancel) {
      this.task = undefined;
      return task.cancel();
    }

    this.logger.debug(`The task ${this} is not cancellable.`);
  }

  validateResult(result) {
    return (0, _task.isFailedRunResult)(result) ? (0, _result_type.asErr)({ ...result,
      error: result.error
    }) : (0, _result_type.asOk)(result || EMPTY_RUN_RESULT);
  }

  async releaseClaimAndIncrementAttempts() {
    return (0, _result_type.promiseResult)(this.bufferedTaskStore.update({ ...this.instance.task,
      status: _task.TaskStatus.Idle,
      attempts: this.instance.task.attempts + 1,
      startedAt: null,
      retryAt: null,
      ownerId: null
    }));
  }

  shouldTryToScheduleRetry() {
    if (this.instance.task.schedule) {
      return true;
    }

    const maxAttempts = this.definition.maxAttempts || this.defaultMaxAttempts;
    return this.instance.task.attempts < maxAttempts;
  }

  async processResultForRecurringTask(result) {
    const hasTaskRunFailed = (0, _result_type.isOk)(result);
    const fieldUpdates = (0, _lodash.flow)( // if running the task has failed ,try to correct by scheduling a retry in the near future
    (0, _result_type.mapErr)(this.rescheduleFailedRun), // if retrying is possible (new runAt) or this is an recurring task - reschedule
    (0, _result_type.mapOk)(({
      runAt,
      schedule: reschedule,
      state,
      attempts = 0
    }) => {
      var _reschedule$interval;

      const {
        startedAt,
        schedule
      } = this.instance.task;
      return (0, _result_type.asOk)({
        runAt: runAt || (0, _intervals.intervalFromDate)(startedAt, (_reschedule$interval = reschedule === null || reschedule === void 0 ? void 0 : reschedule.interval) !== null && _reschedule$interval !== void 0 ? _reschedule$interval : schedule === null || schedule === void 0 ? void 0 : schedule.interval),
        state,
        schedule: reschedule !== null && reschedule !== void 0 ? reschedule : schedule,
        attempts,
        status: _task.TaskStatus.Idle
      });
    }), _result_type.unwrap)(result);
    this.instance = asRan(await this.bufferedTaskStore.update((0, _lodash.defaults)({ ...fieldUpdates,
      // reset fields that track the lifecycle of the concluded `task run`
      startedAt: null,
      retryAt: null,
      ownerId: null
    }, this.instance.task)));
    return fieldUpdates.status === _task.TaskStatus.Failed ? TaskRunResult.Failed : hasTaskRunFailed ? TaskRunResult.SuccessRescheduled : TaskRunResult.RetryScheduled;
  }

  async processResultWhenDone() {
    // not a recurring task: clean up by removing the task instance from store
    try {
      await this.bufferedTaskStore.remove(this.id);
      this.instance = asRan(this.instance.task);
    } catch (err) {
      if (err.statusCode === 404) {
        this.logger.warn(`Task cleanup of ${this} failed in processing. Was remove called twice?`);
      } else {
        throw err;
      }
    }

    return TaskRunResult.Success;
  }

  async processResult(result, taskTiming) {
    const {
      task
    } = this.instance;
    await (0, _result_type.eitherAsync)(result, async ({
      runAt,
      schedule
    }) => {
      this.onTaskEvent((0, _task_events.asTaskRunEvent)(this.id, (0, _result_type.asOk)({
        task,
        result: await (runAt || schedule || task.schedule ? this.processResultForRecurringTask(result) : this.processResultWhenDone())
      }), taskTiming));
    }, async ({
      error
    }) => {
      this.onTaskEvent((0, _task_events.asTaskRunEvent)(this.id, (0, _result_type.asErr)({
        task,
        result: await this.processResultForRecurringTask(result),
        error
      }), taskTiming));
    });
    return result;
  }

  getRetryDelay({
    error,
    attempts,
    addDuration
  }) {
    var _this$definition$getR, _this$definition$getR2, _this$definition; // Use custom retry logic, if any, otherwise we'll use the default logic


    const retry = (_this$definition$getR = (_this$definition$getR2 = (_this$definition = this.definition).getRetry) === null || _this$definition$getR2 === void 0 ? void 0 : _this$definition$getR2.call(_this$definition, attempts, error)) !== null && _this$definition$getR !== void 0 ? _this$definition$getR : true;
    let result;

    if (retry instanceof Date) {
      result = retry;
    } else if (retry === true) {
      result = new Date(Date.now() + attempts * defaultBackoffPerFailure);
    } // Add a duration to the result


    if (addDuration && result) {
      result = (0, _intervals.intervalFromDate)(result, addDuration);
    }

    return result;
  }

}

exports.TaskManagerRunner = TaskManagerRunner;

function sanitizeInstance(instance) {
  return { ...instance,
    params: instance.params || {},
    state: instance.state || {}
  };
}

function howManyMsUntilOwnershipClaimExpires(ownershipClaimedUntil) {
  return ownershipClaimedUntil ? ownershipClaimedUntil.getTime() - Date.now() : 0;
}

function performanceStopMarkingTaskAsRunning() {
  _perf_hooks.performance.mark('markTaskAsRunning_stop');

  _perf_hooks.performance.measure('taskRunner.markTaskAsRunning', 'markTaskAsRunning_start', 'markTaskAsRunning_stop');
} // A type that extracts the Instance type out of TaskRunningStage
// This helps us to better communicate to the developer what the expected "stage"
// in a specific place in the code might be


function isPending(taskRunning) {
  return taskRunning.stage === TaskRunningStage.PENDING;
}

function asPending(task) {
  return {
    timestamp: new Date(),
    stage: TaskRunningStage.PENDING,
    task
  };
}

function isReadyToRun(taskRunning) {
  return taskRunning.stage === TaskRunningStage.READY_TO_RUN;
}

function asReadyToRun(task) {
  return {
    timestamp: new Date(),
    stage: TaskRunningStage.READY_TO_RUN,
    task
  };
}

function asRan(task) {
  return {
    timestamp: new Date(),
    stage: TaskRunningStage.RAN,
    task
  };
}