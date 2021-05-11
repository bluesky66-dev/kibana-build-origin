"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnterpriseSearchPlugin = void 0;

var _server = require("../../../../src/core/server");

var _constants = require("../common/constants");

var _telemetry = require("./collectors/app_search/telemetry");

var _telemetry2 = require("./collectors/enterprise_search/telemetry");

var _telemetry3 = require("./collectors/workplace_search/telemetry");

var _check_access = require("./lib/check_access");

var _enterprise_search_request_handler = require("./lib/enterprise_search_request_handler");

var _app_search = require("./routes/app_search");

var _config_data = require("./routes/enterprise_search/config_data");

var _telemetry4 = require("./routes/enterprise_search/telemetry");

var _workplace_search = require("./routes/workplace_search");

var _telemetry5 = require("./saved_objects/app_search/telemetry");

var _telemetry6 = require("./saved_objects/enterprise_search/telemetry");

var _telemetry7 = require("./saved_objects/workplace_search/telemetry");

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

class EnterpriseSearchPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "logger", void 0);

    this.config = initializerContext.config.get();
    this.logger = initializerContext.logger.get();
  }

  setup({
    capabilities,
    http,
    savedObjects,
    getStartServices
  }, {
    usageCollection,
    security,
    features
  }) {
    const config = this.config;
    const log = this.logger;
    /**
     * Register space/feature control
     */

    features.registerKibanaFeature({
      id: _constants.ENTERPRISE_SEARCH_PLUGIN.ID,
      name: _constants.ENTERPRISE_SEARCH_PLUGIN.NAME,
      order: 0,
      category: _server.DEFAULT_APP_CATEGORIES.enterpriseSearch,
      app: ['kibana', _constants.ENTERPRISE_SEARCH_PLUGIN.ID, _constants.APP_SEARCH_PLUGIN.ID, _constants.WORKPLACE_SEARCH_PLUGIN.ID],
      catalogue: [_constants.ENTERPRISE_SEARCH_PLUGIN.ID, _constants.APP_SEARCH_PLUGIN.ID, _constants.WORKPLACE_SEARCH_PLUGIN.ID],
      privileges: null
    });
    /**
     * Register user access to the Enterprise Search plugins
     */

    capabilities.registerSwitcher(async request => {
      const [, {
        spaces
      }] = await getStartServices();
      const dependencies = {
        config,
        security,
        spaces,
        request,
        log
      };
      const {
        hasAppSearchAccess,
        hasWorkplaceSearchAccess
      } = await (0, _check_access.checkAccess)(dependencies);
      const showEnterpriseSearchOverview = hasAppSearchAccess || hasWorkplaceSearchAccess;
      return {
        navLinks: {
          enterpriseSearch: showEnterpriseSearchOverview,
          appSearch: hasAppSearchAccess,
          workplaceSearch: hasWorkplaceSearchAccess
        },
        catalogue: {
          enterpriseSearch: showEnterpriseSearchOverview,
          appSearch: hasAppSearchAccess,
          workplaceSearch: hasWorkplaceSearchAccess
        }
      };
    });
    /**
     * Register routes
     */

    const router = http.createRouter();
    const enterpriseSearchRequestHandler = new _enterprise_search_request_handler.EnterpriseSearchRequestHandler({
      config,
      log
    });
    const dependencies = {
      router,
      config,
      log,
      enterpriseSearchRequestHandler
    };
    (0, _config_data.registerConfigDataRoute)(dependencies);
    (0, _app_search.registerAppSearchRoutes)(dependencies);
    (0, _workplace_search.registerWorkplaceSearchRoutes)(dependencies);
    /**
     * Bootstrap the routes, saved objects, and collector for telemetry
     */

    savedObjects.registerType(_telemetry6.enterpriseSearchTelemetryType);
    savedObjects.registerType(_telemetry5.appSearchTelemetryType);
    savedObjects.registerType(_telemetry7.workplaceSearchTelemetryType);
    let savedObjectsStarted;
    getStartServices().then(([coreStart]) => {
      savedObjectsStarted = coreStart.savedObjects;

      if (usageCollection) {
        (0, _telemetry2.registerTelemetryUsageCollector)(usageCollection, savedObjectsStarted, this.logger);
        (0, _telemetry.registerTelemetryUsageCollector)(usageCollection, savedObjectsStarted, this.logger);
        (0, _telemetry3.registerTelemetryUsageCollector)(usageCollection, savedObjectsStarted, this.logger);
      }
    });
    (0, _telemetry4.registerTelemetryRoute)({ ...dependencies,
      getSavedObjectsService: () => savedObjectsStarted
    });
  }

  start() {}

  stop() {}

}

exports.EnterpriseSearchPlugin = EnterpriseSearchPlugin;