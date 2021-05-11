"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElasticsearchAndSOAvailability = getElasticsearchAndSOAvailability;
exports.TaskManagerPlugin = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../../src/core/server");

var _polling_lifecycle = require("./polling_lifecycle");

var _middleware = require("./lib/middleware");

var _remove_if_exists = require("./lib/remove_if_exists");

var _saved_objects = require("./saved_objects");

var _task_type_dictionary = require("./task_type_dictionary");

var _task_store = require("./task_store");

var _create_managed_configuration = require("./lib/create_managed_configuration");

var _task_scheduling = require("./task_scheduling");

var _routes = require("./routes");

var _monitoring = require("./monitoring");

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

class TaskManagerPlugin {
  constructor(initContext) {
    this.initContext = initContext;

    _defineProperty(this, "taskPollingLifecycle", void 0);

    _defineProperty(this, "taskManagerId", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "definitions", void 0);

    _defineProperty(this, "middleware", (0, _middleware.createInitialMiddleware)());

    _defineProperty(this, "elasticsearchAndSOAvailability$", void 0);

    _defineProperty(this, "monitoringStats$", new _rxjs.Subject());

    this.initContext = initContext;
    this.logger = initContext.logger.get();
    this.config = initContext.config.get();
    this.definitions = new _task_type_dictionary.TaskTypeDictionary(this.logger);
  }

  setup(core) {
    this.elasticsearchAndSOAvailability$ = getElasticsearchAndSOAvailability(core.status.core$);
    (0, _saved_objects.setupSavedObjects)(core.savedObjects, this.config);
    this.taskManagerId = this.initContext.env.instanceUuid;

    if (!this.taskManagerId) {
      this.logger.error(`TaskManager is unable to start as there the Kibana UUID is invalid (value of the "server.uuid" configuration is ${this.taskManagerId})`);
      throw new Error(`TaskManager is unable to start as Kibana has no valid UUID assigned to it.`);
    } else {
      this.logger.info(`TaskManager is identified by the Kibana UUID: ${this.taskManagerId}`);
    } // Routes


    const router = core.http.createRouter();
    const serviceStatus$ = (0, _routes.healthRoute)(router, this.monitoringStats$, this.logger, this.taskManagerId, this.config);
    core.getStartServices().then(async () => {
      core.status.set((0, _rxjs.combineLatest)([core.status.derivedStatus$, serviceStatus$]).pipe((0, _operators.map)(([derivedStatus, serviceStatus]) => serviceStatus.level > derivedStatus.level ? serviceStatus : derivedStatus)));
    });
    return {
      addMiddleware: middleware => {
        this.assertStillInSetup('add Middleware');
        this.middleware = (0, _middleware.addMiddlewareToChain)(this.middleware, middleware);
      },
      registerTaskDefinitions: taskDefinition => {
        this.assertStillInSetup('register task definitions');
        this.definitions.registerTaskDefinitions(taskDefinition);
      }
    };
  }

  start({
    savedObjects,
    elasticsearch
  }) {
    const savedObjectsRepository = savedObjects.createInternalRepository(['task']);
    const serializer = savedObjects.createSerializer();
    const taskStore = new _task_store.TaskStore({
      serializer,
      savedObjectsRepository,
      esClient: elasticsearch.createClient('taskManager').asInternalUser,
      index: this.config.index,
      definitions: this.definitions,
      taskManagerId: `kibana:${this.taskManagerId}`
    });
    const managedConfiguration = (0, _create_managed_configuration.createManagedConfiguration)({
      logger: this.logger,
      errors$: taskStore.errors$,
      startingMaxWorkers: this.config.max_workers,
      startingPollInterval: this.config.poll_interval
    });
    this.taskPollingLifecycle = new _polling_lifecycle.TaskPollingLifecycle({
      config: this.config,
      definitions: this.definitions,
      logger: this.logger,
      taskStore,
      middleware: this.middleware,
      elasticsearchAndSOAvailability$: this.elasticsearchAndSOAvailability$,
      ...managedConfiguration
    });
    (0, _monitoring.createMonitoringStats)(this.taskPollingLifecycle, taskStore, this.elasticsearchAndSOAvailability$, this.config, managedConfiguration, this.logger).subscribe(stat => this.monitoringStats$.next(stat));
    const taskScheduling = new _task_scheduling.TaskScheduling({
      logger: this.logger,
      taskStore,
      middleware: this.middleware,
      taskPollingLifecycle: this.taskPollingLifecycle,
      definitions: this.definitions
    });
    return {
      fetch: opts => taskStore.fetch(opts),
      get: id => taskStore.get(id),
      remove: id => taskStore.remove(id),
      removeIfExists: id => (0, _remove_if_exists.removeIfExists)(taskStore, id),
      schedule: (...args) => taskScheduling.schedule(...args),
      ensureScheduled: (...args) => taskScheduling.ensureScheduled(...args),
      runNow: (...args) => taskScheduling.runNow(...args)
    };
  }
  /**
   * Ensures task manager hasn't started
   *
   * @param {string} the name of the operation being executed
   * @returns void
   */


  assertStillInSetup(operation) {
    var _this$taskPollingLife;

    if ((_this$taskPollingLife = this.taskPollingLifecycle) !== null && _this$taskPollingLife !== void 0 && _this$taskPollingLife.isStarted) {
      throw new Error(`Cannot ${operation} after the task manager has started`);
    }
  }

}

exports.TaskManagerPlugin = TaskManagerPlugin;

function getElasticsearchAndSOAvailability(core$) {
  return core$.pipe((0, _operators.map)(({
    elasticsearch,
    savedObjects
  }) => elasticsearch.level === _server.ServiceStatusLevels.available && savedObjects.level === _server.ServiceStatusLevels.available), (0, _operators.distinctUntilChanged)());
}