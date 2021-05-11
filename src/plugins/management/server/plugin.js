"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagementServerPlugin = void 0;

var _capabilities_provider = require("./capabilities_provider");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ManagementServerPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "logger", void 0);

    this.logger = initializerContext.logger.get();
  }

  setup(core) {
    this.logger.debug('management: Setup');
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    return {};
  }

  start(core) {
    this.logger.debug('management: Started');
    return {};
  }

  stop() {}

}

exports.ManagementServerPlugin = ManagementServerPlugin;