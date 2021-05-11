"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DashboardModeServerPlugin = void 0;

var _server = require("../../../../src/core/server");

var _interceptors = require("./interceptors");

var _ui_settings = require("./ui_settings");

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

class DashboardModeServerPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "initializerContext", void 0);

    _defineProperty(this, "logger", void 0);

    this.initializerContext = initializerContext;
  }

  setup(core, {
    security
  }) {
    this.logger = this.initializerContext.logger.get();
    core.uiSettings.register((0, _ui_settings.getUiSettings)());

    const getUiSettingsClient = async () => {
      const [coreStart] = await core.getStartServices();
      const {
        savedObjects,
        uiSettings
      } = coreStart;
      const savedObjectsClient = new _server.SavedObjectsClient(savedObjects.createInternalRepository());
      return uiSettings.asScopedToClient(savedObjectsClient);
    };

    if (security) {
      const dashboardModeRequestInterceptor = (0, _interceptors.setupDashboardModeRequestInterceptor)({
        http: core.http,
        security,
        getUiSettingsClient
      });
      core.http.registerOnPostAuth(dashboardModeRequestInterceptor);
      this.logger.debug(`registered DashboardModeRequestInterceptor`);
    }
  }

  start(core) {}

  stop() {}

}

exports.DashboardModeServerPlugin = DashboardModeServerPlugin;