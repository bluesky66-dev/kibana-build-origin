"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LensServerPlugin = void 0;

var _routes = require("./routes");

var _usage = require("./usage");

var _saved_objects = require("./saved_objects");

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

class LensServerPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "kibanaIndexConfig", void 0);

    _defineProperty(this, "telemetryLogger", void 0);

    this.kibanaIndexConfig = initializerContext.config.legacy.globalConfig$;
    this.telemetryLogger = initializerContext.logger.get('usage');
  }

  setup(core, plugins) {
    (0, _saved_objects.setupSavedObjects)(core);
    (0, _routes.setupRoutes)(core, this.initializerContext.logger.get());

    if (plugins.usageCollection && plugins.taskManager) {
      (0, _usage.registerLensUsageCollector)(plugins.usageCollection, core.getStartServices().then(([_, {
        taskManager
      }]) => taskManager));
      (0, _usage.initializeLensTelemetry)(this.telemetryLogger, core, this.kibanaIndexConfig, plugins.taskManager);
    }

    return {};
  }

  start(core, plugins) {
    if (plugins.taskManager) {
      (0, _usage.scheduleLensTelemetry)(this.telemetryLogger, plugins.taskManager);
    }

    return {};
  }

  stop() {}

}

exports.LensServerPlugin = LensServerPlugin;