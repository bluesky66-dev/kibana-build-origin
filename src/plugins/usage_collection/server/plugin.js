"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageCollectionPlugin = void 0;

var _collector = require("./collector");

var _routes = require("./routes");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UsageCollectionPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "savedObjects", void 0);

    this.logger = this.initializerContext.logger.get();
  }

  setup(core) {
    const config = this.initializerContext.config.get();
    const collectorSet = new _collector.CollectorSet({
      logger: this.logger.get('collector-set'),
      maximumWaitTimeForAllCollectorsInS: config.maximumWaitTimeForAllCollectorsInS
    });
    const globalConfig = this.initializerContext.config.legacy.get();
    const router = core.http.createRouter();
    (0, _routes.setupRoutes)({
      router,
      getSavedObjects: () => this.savedObjects,
      collectorSet,
      config: {
        allowAnonymous: core.status.isStatusPageAnonymous(),
        kibanaIndex: globalConfig.kibana.index,
        kibanaVersion: this.initializerContext.env.packageInfo.version,
        server: core.http.getServerInfo(),
        uuid: this.initializerContext.env.instanceUuid
      },
      metrics: core.metrics,
      overallStatus$: core.status.overall$
    });
    return collectorSet;
  }

  start({
    savedObjects
  }) {
    this.logger.debug('Starting plugin');
    this.savedObjects = savedObjects.createInternalRepository();
  }

  stop() {
    this.logger.debug('Stopping plugin');
  }

}

exports.UsageCollectionPlugin = UsageCollectionPlugin;