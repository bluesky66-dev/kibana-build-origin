"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardPlugin = void 0;

var _saved_objects = require("./saved_objects");

var _capabilities_provider = require("./capabilities_provider");

var _register_collector = require("./usage/register_collector");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DashboardPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "logger", void 0);

    this.logger = initializerContext.logger.get();
  }

  setup(core, plugins) {
    this.logger.debug('dashboard: Setup');
    core.savedObjects.registerType((0, _saved_objects.createDashboardSavedObjectType)({
      migrationDeps: {
        embeddable: plugins.embeddable
      }
    }));
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    (0, _register_collector.registerDashboardUsageCollector)(plugins.usageCollection, plugins.embeddable);
    return {};
  }

  start(core) {
    this.logger.debug('dashboard: Started');
    return {};
  }

  stop() {}

}

exports.DashboardPlugin = DashboardPlugin;