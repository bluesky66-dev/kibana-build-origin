"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claimAvailableTasks = claimAvailableTasks;
exports.TaskPollingLifecycle = void 0;

var _rxjs = require("rxjs");

var _pipeable = require("fp-ts/lib/pipeable");

var _Option = require("fp-ts/lib/Option");

var _operators = require("rxjs/operators");

var _result_type = require("./lib/result_type");

var _task_events = require("./task_events");

var _fill_pool = require("./lib/fill_pool");

var _intervals = require("./lib/intervals");

var _polling = require("./polling");

var _task_pool = require("./task_pool");

var _task_running = require("./task_running");

var _identify_es_error = require("./lib/identify_es_error");

var _buffered_task_store = require("./buffered_task_store");

var _task_claiming = require("./queries/task_claiming");

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
 * The public interface into the task manager system.
 */


class TaskPollingLifecycle {
  // all task related events (task claimed, task marked as running, etc.) are emitted through events$
  // all on-demand requests we wish to pipe into the poller
  // our subscription to the poller

  /**
   * Initializes the task manager, preventing any further addition of middleware,
   * enabling the task manipulation methods, and beginning the background polling
   * mechanism.
   */
  constructor({
    logger,
    middleware,
    maxWorkersConfiguration$,
    pollIntervalConfiguration$,
    // Elasticsearch and SavedObjects availability status
    elasticsearchAndSOAvailability$,
    config,
    taskStore,
    definitions
  }) {
    _defineProperty(this, "definitions", void 0);

    _defineProperty(this, "store", void 0);

    _defineProperty(this, "taskClaiming", void 0);

    _defineProperty(this, "bufferedStore", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "pool", void 0);

    _defineProperty(this, "events$", new _rxjs.Subject());

    _defineProperty(this, "claimRequests$", new _rxjs.Subject());

    _defineProperty(this, "pollingSubscription", _rxjs.Subscription.EMPTY);

    _defineProperty(this, "middleware", void 0);

    _defineProperty(this, "emitEvent", event => {
      this.events$.next(event);
    });

    _defineProperty(this, "createTaskRunnerForTask", instance => {
      return new _task_running.TaskManagerRunner({
        logger: this.logger,
        instance,
        store: this.bufferedStore,
        definitions: this.definitions,
        beforeRun: this.middleware.beforeRun,
        beforeMarkRunning: this.middleware.beforeMarkRunning,
        onTaskEvent: this.emitEvent,
        defaultMaxAttempts: this.taskClaiming.maxAttempts
      });
    });

    _defineProperty(this, "pollForWork", async (...tasksToClaim) => {
      return (0, _fill_pool.fillPool)( // claim available tasks
      () => claimAvailableTasks(tasksToClaim.splice(0, this.pool.availableWorkers), this.taskClaiming, this.logger).pipe((0, _operators.tap)((0, _result_type.mapOk)(({
        timing
      }) => {
        if (timing) {
          this.emitEvent((0, _task_events.asTaskManagerStatEvent)('claimDuration', (0, _result_type.asOk)(timing.stop - timing.start)));
        }
      }))), // wrap each task in a Task Runner
      this.createTaskRunnerForTask, // place tasks in the Task Pool
      async tasks => await this.pool.run(tasks));
    });

    this.logger = logger;
    this.middleware = middleware;
    this.definitions = definitions;
    this.store = taskStore;

    const emitEvent = event => this.events$.next(event);

    this.bufferedStore = new _buffered_task_store.BufferedTaskStore(this.store, {
      bufferMaxOperations: config.max_workers,
      logger
    });
    this.pool = new _task_pool.TaskPool({
      logger,
      maxWorkers$: maxWorkersConfiguration$
    });
    this.pool.load.subscribe(emitEvent);
    this.taskClaiming = new _task_claiming.TaskClaiming({
      taskStore,
      maxAttempts: config.max_attempts,
      definitions,
      logger: this.logger,
      getCapacity: taskType => {
        var _this$definitions$get;

        return taskType && (_this$definitions$get = this.definitions.get(taskType)) !== null && _this$definitions$get !== void 0 && _this$definitions$get.maxConcurrency ? Math.max(Math.min(this.pool.availableWorkers, this.definitions.get(taskType).maxConcurrency - this.pool.getOccupiedWorkersByType(taskType)), 0) : this.pool.availableWorkers;
      }
    }); // pipe taskClaiming events into the lifecycle event stream

    this.taskClaiming.events.subscribe(emitEvent);
    const {
      max_poll_inactivity_cycles: maxPollInactivityCycles,
      poll_interval: pollInterval
    } = config;
    const pollIntervalDelay$ = (0, _polling.delayOnClaimConflicts)(maxWorkersConfiguration$, pollIntervalConfiguration$, this.events$, config.version_conflict_threshold, config.monitored_stats_running_average_window).pipe((0, _operators.tap)(delay => emitEvent((0, _task_events.asTaskManagerStatEvent)('pollingDelay', (0, _result_type.asOk)(delay))))); // the task poller that polls for work on fixed intervals and on demand

    const poller$ = (0, _polling.createObservableMonitor)(() => (0, _polling.createTaskPoller)({
      logger,
      pollInterval$: pollIntervalConfiguration$,
      pollIntervalDelay$,
      bufferCapacity: config.request_capacity,
      getCapacity: () => this.pool.availableWorkers,
      pollRequests$: this.claimRequests$,
      work: this.pollForWork,
      // Time out the `work` phase if it takes longer than a certain number of polling cycles
      // The `work` phase includes the prework needed *before* executing a task
      // (such as polling for new work, marking tasks as running etc.) but does not
      // include the time of actually running the task
      workTimeout: pollInterval * maxPollInactivityCycles
    }), {
      heartbeatInterval: pollInterval,
      // Time out the poller itself if it has failed to complete the entire stream for a certain amount of time.
      // This is different that the `work` timeout above, as the poller could enter an invalid state where
      // it fails to complete a cycle even thought `work` is completing quickly.
      // We grant it a single cycle longer than the time alotted to `work` so that timing out the `work`
      // doesn't get short circuited by the monitor reinstantiating the poller all together (a far more expensive
      // operation than just timing out the `work` internally)
      inactivityTimeout: pollInterval * (maxPollInactivityCycles + 1),
      onError: error => {
        logger.error(`[Task Poller Monitor]: ${error.message}`);
      }
    });
    elasticsearchAndSOAvailability$.subscribe(areESAndSOAvailable => {
      if (areESAndSOAvailable && !this.isStarted) {
        // start polling for work
        this.pollingSubscription = this.subscribeToPoller(poller$);
      } else if (!areESAndSOAvailable && this.isStarted) {
        this.pollingSubscription.unsubscribe();
        this.pool.cancelRunningTasks();
      }
    });
  }

  get events() {
    return this.events$;
  }

  attemptToRun(task) {
    this.claimRequests$.next((0, _Option.some)(task));
  }

  get isStarted() {
    return !this.pollingSubscription.closed;
  }

  subscribeToPoller(poller$) {
    return poller$.pipe((0, _operators.tap)((0, _result_type.mapErr)(error => {
      if (error.type === _polling.PollingErrorType.RequestCapacityReached) {
        (0, _pipeable.pipe)(error.data, (0, _Option.map)(id => this.emitEvent((0, _task_events.asTaskRunRequestEvent)(id, (0, _result_type.asErr)(error)))));
      }

      this.logger.error(error.message);
    }))).subscribe(result => {
      this.emitEvent((0, _result_type.map)(result, ({
        timing,
        ...event
      }) => (0, _task_events.asTaskPollingCycleEvent)((0, _result_type.asOk)(event), timing), event => (0, _task_events.asTaskPollingCycleEvent)((0, _result_type.asErr)(event))));
    });
  }

}

exports.TaskPollingLifecycle = TaskPollingLifecycle;

function claimAvailableTasks(claimTasksById, taskClaiming, logger) {
  return new _rxjs.Observable(observer => {
    taskClaiming.claimAvailableTasksIfCapacityIsAvailable({
      claimOwnershipUntil: (0, _intervals.intervalFromNow)('30s'),
      claimTasksById
    }).subscribe(claimResult => {
      observer.next(claimResult);
    }, ex => {
      // if the `taskClaiming` stream errors out we want to catch it and see if
      // we can identify the reason
      // if we can - we emit an FillPoolResult error rather than erroring out the wrapping Observable
      // returned by `claimAvailableTasks`
      if ((0, _identify_es_error.identifyEsError)(ex).includes('cannot execute [inline] scripts')) {
        logger.warn(`Task Manager cannot operate when inline scripts are disabled in Elasticsearch`);
        observer.next((0, _result_type.asErr)(_fill_pool.FillPoolResult.Failed));
        observer.complete();
      } else {
        // as we could't identify the reason - we'll error out the wrapping Observable too
        observer.error(ex);
      }
    }, () => {
      observer.complete();
    });
  });
}