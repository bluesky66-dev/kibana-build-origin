"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisTypeVegaPlugin = void 0;

var _usage_collector = require("./usage_collector");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class VisTypeVegaPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "config", void 0);

    this.config = initializerContext.config.legacy.globalConfig$;
  }

  setup(core, {
    home,
    usageCollection
  }) {
    if (usageCollection) {
      (0, _usage_collector.registerVegaUsageCollector)(usageCollection, this.config, {
        home
      });
    }

    return {};
  }

  start(core) {
    return {};
  }

  stop() {}

}

exports.VisTypeVegaPlugin = VisTypeVegaPlugin;