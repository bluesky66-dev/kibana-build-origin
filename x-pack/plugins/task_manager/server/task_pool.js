"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskPool = exports.TaskPoolRunResult = void 0;

var _rxjs = require("rxjs");

var _moment = _interopRequireDefault(require("moment"));

var _perf_hooks = require("perf_hooks");

var _lodash = require("lodash");

var _is_task_not_found_error = require("./lib/is_task_not_found_error");

var _task_events = require("./task_events");

var _result_type = require("./lib/result_type");

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

let TaskPoolRunResult;
exports.TaskPoolRunResult = TaskPoolRunResult;

(function (TaskPoolRunResult) {
  TaskPoolRunResult["NoTaskWereRan"] = "NoTaskWereRan";
  TaskPoolRunResult["RunningAllClaimedTasks"] = "RunningAllClaimedTasks";
  TaskPoolRunResult["RunningAtCapacity"] = "RunningAtCapacity";
  TaskPoolRunResult["RanOutOfCapacity"] = "RanOutOfCapacity";
})(TaskPoolRunResult || (exports.TaskPoolRunResult = TaskPoolRunResult = {}));

const VERSION_CONFLICT_MESSAGE = 'Task has been claimed by another Kibana service';
/**
 * Runs tasks in batches, taking costs into account.
 */

class TaskPool {
  /**
   * Creates an instance of TaskPool.
   *
   * @param {Opts} opts
   * @prop {number} maxWorkers - The total number of workers / work slots available
   *    (e.g. maxWorkers is 4, then 2 tasks of cost 2 can run at a time, or 4 tasks of cost 1)
   * @prop {Logger} logger - The task manager logger.
   */
  constructor(opts) {
    _defineProperty(this, "maxWorkers", 0);

    _defineProperty(this, "tasksInPool", new Map());

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "load$", new _rxjs.Subject());

    _defineProperty(this, "run", async tasks => {
      const [tasksToRun, leftOverTasks] = partitionListByCount(tasks, this.availableWorkers);

      if (tasksToRun.length) {
        _perf_hooks.performance.mark('attemptToRun_start');

        await Promise.all(tasksToRun.filter(taskRunner => !this.tasksInPool.has(taskRunner.id)).map(async taskRunner => {
          this.tasksInPool.set(taskRunner.id, taskRunner);
          return taskRunner.markTaskAsRunning().then(hasTaskBeenMarkAsRunning => hasTaskBeenMarkAsRunning ? this.handleMarkAsRunning(taskRunner) : this.handleFailureOfMarkAsRunning(taskRunner, {
            name: 'TaskPoolVersionConflictError',
            message: VERSION_CONFLICT_MESSAGE
          })).catch(err => this.handleFailureOfMarkAsRunning(taskRunner, err));
        }));

        _perf_hooks.performance.mark('attemptToRun_stop');

        _perf_hooks.performance.measure('taskPool.attemptToRun', 'attemptToRun_start', 'attemptToRun_stop');
      }

      if (leftOverTasks.length) {
        if (this.availableWorkers) {
          return this.run(leftOverTasks);
        }

        return TaskPoolRunResult.RanOutOfCapacity;
      } else if (!this.availableWorkers) {
        return TaskPoolRunResult.RunningAtCapacity;
      }

      return TaskPoolRunResult.RunningAllClaimedTasks;
    });

    this.logger = opts.logger;
    opts.maxWorkers$.subscribe(maxWorkers => {
      this.logger.debug(`Task pool now using ${maxWorkers} as the max worker value`);
      this.maxWorkers = maxWorkers;
    });
  }

  get load() {
    return this.load$;
  }
  /**
   * Gets how many workers are currently in use.
   */


  get occupiedWorkers() {
    return this.tasksInPool.size;
  }
  /**
   * Gets % of workers in use
   */


  get workerLoad() {
    return this.maxWorkers ? Math.round(this.occupiedWorkers * 100 / this.maxWorkers) : 100;
  }
  /**
   * Gets how many workers are currently available.
   */


  get availableWorkers() {
    // emit load whenever we check how many available workers there are
    // this should happen less often than the actual changes to the worker queue
    // so is lighter than emitting the load every time we add/remove a task from the queue
    this.load$.next((0, _task_events.asTaskManagerStatEvent)('load', (0, _result_type.asOk)(this.workerLoad))); // cancel expired task whenever a call is made to check for capacity
    // this ensures that we don't end up with a queue of hung tasks causing both
    // the poller and the pool from hanging due to lack of capacity

    this.cancelExpiredTasks();
    return this.maxWorkers - this.occupiedWorkers;
  }
  /**
   * Gets how many workers are currently in use by type.
   */


  getOccupiedWorkersByType(type) {
    return [...this.tasksInPool.values()].reduce((count, runningTask) => runningTask.definition.type === type ? ++count : count, 0);
  }
  /**
   * Attempts to run the specified list of tasks. Returns true if it was able
   * to start every task in the list, false if there was not enough capacity
   * to run every task.
   *
   * @param {TaskRunner[]} tasks
   * @returns {Promise<boolean>}
   */


  cancelRunningTasks() {
    this.logger.debug('Cancelling running tasks.');

    for (const task of this.tasksInPool.values()) {
      this.cancelTask(task);
    }
  }

  handleMarkAsRunning(taskRunner) {
    taskRunner.run().catch(err => {
      // If a task Saved Object can't be found by an in flight task runner
      // we asssume the underlying task has been deleted while it was running
      // so we will log this as a debug, rather than a warn
      const errorLogLine = `Task ${taskRunner.toString()} failed in attempt to run: ${err.message}`;

      if ((0, _is_task_not_found_error.isTaskSavedObjectNotFoundError)(err, taskRunner.id)) {
        this.logger.debug(errorLogLine);
      } else {
        this.logger.warn(errorLogLine);
      }
    }).then(() => this.tasksInPool.delete(taskRunner.id));
  }

  handleFailureOfMarkAsRunning(task, err) {
    this.tasksInPool.delete(task.id);
    this.logger.error(`Failed to mark Task ${task.toString()} as running: ${err.message}`);
  }

  cancelExpiredTasks() {
    for (const taskRunner of this.tasksInPool.values()) {
      if (taskRunner.isExpired) {
        this.logger.warn(`Cancelling task ${taskRunner.toString()} as it expired at ${taskRunner.expiration.toISOString()}${taskRunner.startedAt ? ` after running for ${durationAsString(_moment.default.duration((0, _moment.default)(new Date()).utc().diff(taskRunner.startedAt)))}` : ``}${taskRunner.definition.timeout ? ` (with timeout set at ${taskRunner.definition.timeout})` : ``}.`);
        this.cancelTask(taskRunner);
      }
    }
  }

  async cancelTask(task) {
    try {
      this.logger.debug(`Cancelling task ${task.toString()}.`);
      this.tasksInPool.delete(task.id);
      await task.cancel();
    } catch (err) {
      this.logger.error(`Failed to cancel task ${task.toString()}: ${err}`);
    }
  }

}

exports.TaskPool = TaskPool;

function partitionListByCount(list, count) {
  const listInCount = list.splice(0, count);
  return [listInCount, list];
}

function durationAsString(duration) {
  const [m, s] = [duration.minutes(), duration.seconds()].map(value => (0, _lodash.padStart)(`${value}`, 2, '0'));
  return `${m}m ${s}s`;
}