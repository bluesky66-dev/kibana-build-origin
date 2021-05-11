"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskScheduling = void 0;

var _operators = require("rxjs/operators");

var _pipeable = require("fp-ts/lib/pipeable");

var _Option = require("fp-ts/lib/Option");

var _result_type = require("./lib/result_type");

var _task_events = require("./task_events");

var _task = require("./task");

var _correct_deprecated_fields = require("./lib/correct_deprecated_fields");

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

const VERSION_CONFLICT_STATUS = 409;

class TaskScheduling {
  /**
   * Initializes the task manager, preventing any further addition of middleware,
   * enabling the task manipulation methods, and beginning the background polling
   * mechanism.
   */
  constructor(opts) {
    _defineProperty(this, "store", void 0);

    _defineProperty(this, "taskPollingLifecycle", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "middleware", void 0);

    _defineProperty(this, "definitions", void 0);

    this.logger = opts.logger;
    this.middleware = opts.middleware;
    this.taskPollingLifecycle = opts.taskPollingLifecycle;
    this.store = opts.taskStore;
    this.definitions = opts.definitions;
  }
  /**
   * Schedules a task.
   *
   * @param task - The task being scheduled.
   * @returns {Promise<ConcreteTaskInstance>}
   */


  async schedule(taskInstance, options) {
    const {
      taskInstance: modifiedTask
    } = await this.middleware.beforeSave({ ...options,
      taskInstance: (0, _correct_deprecated_fields.ensureDeprecatedFieldsAreCorrected)(taskInstance, this.logger)
    });
    return await this.store.schedule(modifiedTask);
  }
  /**
   * Run  task.
   *
   * @param taskId - The task being scheduled.
   * @returns {Promise<ConcreteTaskInstance>}
   */


  async runNow(taskId) {
    return new Promise(async (resolve, reject) => {
      this.awaitTaskRunResult(taskId).then(resolve).catch(reject);
      this.taskPollingLifecycle.attemptToRun(taskId);
    });
  }
  /**
   * Schedules a task with an Id
   *
   * @param task - The task being scheduled.
   * @returns {Promise<TaskInstanceWithId>}
   */


  async ensureScheduled(taskInstance, options) {
    try {
      return await this.schedule(taskInstance, options);
    } catch (err) {
      if (err.statusCode === VERSION_CONFLICT_STATUS) {
        return taskInstance;
      }

      throw err;
    }
  }

  async awaitTaskRunResult(taskId) {
    return new Promise((resolve, reject) => {
      const subscription = this.taskPollingLifecycle.events // listen for all events related to the current task
      .pipe((0, _operators.filter)(({
        id
      }) => id === taskId)).subscribe(taskEvent => {
        if ((0, _task_events.isTaskClaimEvent)(taskEvent)) {
          (0, _result_type.mapErr)(async error => {
            // reject if any error event takes place for the requested task
            subscription.unsubscribe();

            if ((0, _Option.isSome)(error.task) && error.errorType === _task_events.TaskClaimErrorType.CLAIMED_BY_ID_OUT_OF_CAPACITY) {
              var _definition$title;

              const task = error.task.value;
              const definition = this.definitions.get(task.taskType);
              return reject(new Error(`Failed to run task "${taskId}" as we would exceed the max concurrency of "${(_definition$title = definition === null || definition === void 0 ? void 0 : definition.title) !== null && _definition$title !== void 0 ? _definition$title : task.taskType}" which is ${definition === null || definition === void 0 ? void 0 : definition.maxConcurrency}. Rescheduled the task to ensure it is picked up as soon as possible.`));
            } else {
              return reject(await this.identifyTaskFailureReason(taskId, error.task));
            }
          }, taskEvent.event);
        } else {
          (0, _result_type.either)(taskEvent.event, taskInstance => {
            // resolve if the task has run sucessfully
            if ((0, _task_events.isTaskRunEvent)(taskEvent)) {
              subscription.unsubscribe();
              resolve({
                id: taskInstance.task.id
              });
            }
          }, async errorResult => {
            // reject if any error event takes place for the requested task
            subscription.unsubscribe();
            return reject(new Error(`Failed to run task "${taskId}": ${(0, _task_events.isTaskRunRequestEvent)(taskEvent) ? `Task Manager is at capacity, please try again later` : (0, _task_events.isTaskRunEvent)(taskEvent) ? `${errorResult.error}` : `${errorResult}`}`));
          });
        }
      });
    });
  }

  async identifyTaskFailureReason(taskId, error) {
    return (0, _result_type.map)(await (0, _pipeable.pipe)(error, (0, _Option.map)(async taskReturnedBySweep => (0, _result_type.asOk)(taskReturnedBySweep.status)), (0, _Option.getOrElse)(() => // if the error happened in the Claim phase - we try to provide better insight
    // into why we failed to claim by getting the task's current lifecycle status
    (0, _result_type.promiseResult)(this.store.getLifecycle(taskId)))), taskLifecycleStatus => {
      if (taskLifecycleStatus === _task.TaskLifecycleResult.NotFound) {
        return new Error(`Failed to run task "${taskId}" as it does not exist`);
      } else if (taskLifecycleStatus === _task.TaskStatus.Running || taskLifecycleStatus === _task.TaskStatus.Claiming) {
        return new Error(`Failed to run task "${taskId}" as it is currently running`);
      }

      return new Error(`Failed to run task "${taskId}" for unknown reason (Current Task Lifecycle is "${taskLifecycleStatus}")`);
    }, getLifecycleError => new Error(`Failed to run task "${taskId}" and failed to get current Status:${getLifecycleError}`));
  }

}

exports.TaskScheduling = TaskScheduling;