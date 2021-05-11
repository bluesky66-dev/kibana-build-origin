"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = void 0;

var _kibana = require("./kibana.index");

var _adapters = require("./lib/adapters");

var _saved_objects = require("./lib/saved_objects");

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

class Plugin {
  constructor(_initializerContext) {
    _defineProperty(this, "savedObjectsClient", void 0);
  }

  setup(core, plugins) {
    (0, _kibana.initServerWithKibana)({
      router: core.http.createRouter()
    }, plugins);
    core.savedObjects.registerType(_saved_objects.umDynamicSettings);

    _adapters.KibanaTelemetryAdapter.registerUsageCollector(plugins.usageCollection, () => this.savedObjectsClient);
  }

  start(core, _plugins) {
    this.savedObjectsClient = core.savedObjects.createInternalRepository();
  }

  stop() {}

}

exports.Plugin = Plugin;