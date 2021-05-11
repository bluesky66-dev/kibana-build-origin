"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsManagementPlugin = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _services = require("./services");

var _routes = require("./routes");

var _capabilities_provider = require("./capabilities_provider");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SavedObjectsManagementPlugin {
  constructor(context) {
    this.context = context;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "managementService$", new _rxjs.Subject());

    this.logger = this.context.logger.get();
  }

  setup({
    http,
    capabilities
  }) {
    this.logger.debug('Setting up SavedObjectsManagement plugin');
    (0, _routes.registerRoutes)({
      http,
      managementServicePromise: this.managementService$.pipe((0, _operators.first)()).toPromise()
    });
    capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    return {};
  }

  start(core) {
    this.logger.debug('Starting up SavedObjectsManagement plugin');
    const managementService = new _services.SavedObjectsManagement(core.savedObjects.getTypeRegistry());
    this.managementService$.next(managementService);
    return {};
  }

}

exports.SavedObjectsManagementPlugin = SavedObjectsManagementPlugin;