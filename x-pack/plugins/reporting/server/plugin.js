"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportingPlugin = void 0;

var _constants = require("../common/constants");

var _ = require("./");

var _browsers = require("./browsers");

var _config = require("./config");

var _lib = require("./lib");

var _routes = require("./routes");

var _services = require("./services");

var _usage = require("./usage");

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

class ReportingPlugin {
  constructor(context) {
    _defineProperty(this, "initializerContext", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "reportingCore", void 0);

    this.logger = new _lib.LevelLogger(context.logger.get());
    this.initializerContext = context;
    this.reportingCore = new _.ReportingCore(this.logger);
  }

  setup(core, plugins) {
    // prevent throwing errors in route handlers about async deps not being initialized
    // @ts-expect-error null is not assignable to object. use a boolean property to ensure reporting API is enabled.
    core.http.registerRouteHandlerContext(_constants.PLUGIN_ID, () => {
      if (this.reportingCore.pluginIsStarted()) {
        return {}; // ReportingStart contract
      } else {
        return null;
      }
    });
    (0, _config.registerUiSettings)(core);
    const {
      elasticsearch,
      http
    } = core;
    const {
      features,
      licensing,
      security,
      spaces
    } = plugins;
    const {
      initializerContext: initContext,
      reportingCore
    } = this;
    const router = http.createRouter();
    const basePath = http.basePath;
    reportingCore.pluginSetup({
      features,
      elasticsearch,
      licensing,
      basePath,
      router,
      security,
      spaces
    });
    (0, _usage.registerReportingUsageCollector)(reportingCore, plugins);
    (0, _routes.registerRoutes)(reportingCore, this.logger); // async background setup

    (async () => {
      const config = await (0, _config.buildConfig)(initContext, core, this.logger);
      reportingCore.setConfig(config); // Feature registration relies on config, so it cannot be setup before here.

      reportingCore.registerFeature();
      this.logger.debug('Setup complete');
    })().catch(e => {
      this.logger.error(`Error in Reporting setup, reporting may not function properly`);
      this.logger.error(e);
    });
    return {};
  }

  start(core, plugins) {
    // use data plugin for csv formats
    (0, _services.setFieldFormats)(plugins.data.fieldFormats);
    const {
      logger,
      reportingCore
    } = this; // async background start

    (async () => {
      await this.reportingCore.pluginSetsUp();
      const config = reportingCore.getConfig();
      const browserDriverFactory = await (0, _browsers.initializeBrowserDriverFactory)(config, logger);
      const store = new _lib.ReportingStore(reportingCore, logger);
      const esqueue = await (0, _lib.createQueueFactory)(reportingCore, store, logger); // starts polling for pending jobs

      reportingCore.pluginStart({
        browserDriverFactory,
        savedObjects: core.savedObjects,
        uiSettings: core.uiSettings,
        esqueue,
        store
      });
      this.logger.debug('Start complete');
    })().catch(e => {
      this.logger.error(`Error in Reporting start, reporting may not function properly`);
      this.logger.error(e);
    });
    return {};
  }

}

exports.ReportingPlugin = ReportingPlugin;