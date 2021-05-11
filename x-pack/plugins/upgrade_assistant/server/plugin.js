"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpgradeAssistantServerPlugin = void 0;

var _operators = require("rxjs/operators");

var _server = require("../../../../src/core/server");

var _extract_index_patterns = require("./lib/apm/extract_index_patterns");

var _credential_store = require("./lib/reindexing/credential_store");

var _telemetry = require("./lib/telemetry");

var _version = require("./lib/version");

var _cluster_checkup = require("./routes/cluster_checkup");

var _deprecation_logging = require("./routes/deprecation_logging");

var _query_default_field = require("./routes/query_default_field");

var _reindex_indices = require("./routes/reindex_indices");

var _telemetry2 = require("./routes/telemetry");

var _saved_object_types = require("./saved_object_types");

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

class UpgradeAssistantServerPlugin {
  // Properties set at setup
  // Properties set at start
  constructor({
    logger,
    env
  }) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "credentialStore", void 0);

    _defineProperty(this, "kibanaVersion", void 0);

    _defineProperty(this, "licensing", void 0);

    _defineProperty(this, "apmOSS", void 0);

    _defineProperty(this, "savedObjectsServiceStart", void 0);

    _defineProperty(this, "worker", void 0);

    this.logger = logger.get();
    this.credentialStore = (0, _credential_store.credentialStoreFactory)();
    this.kibanaVersion = env.packageInfo.version;
  }

  getWorker() {
    if (!this.worker) {
      throw new Error('Worker unavailable');
    }

    return this.worker;
  }

  setup({
    http,
    getStartServices,
    capabilities,
    savedObjects
  }, {
    usageCollection,
    cloud,
    features,
    licensing,
    apmOss: apmOSS
  }) {
    this.licensing = licensing;
    this.apmOSS = apmOSS;
    savedObjects.registerType(_saved_object_types.reindexOperationSavedObjectType);
    savedObjects.registerType(_saved_object_types.telemetrySavedObjectType);
    features.registerElasticsearchFeature({
      id: 'upgrade_assistant',
      management: {
        stack: ['upgrade_assistant']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage'],
        ui: []
      }]
    });
    const router = http.createRouter();
    const dependencies = {
      cloud,
      router,
      apmOSS,
      credentialStore: this.credentialStore,
      log: this.logger,
      getSavedObjectsService: () => {
        if (!this.savedObjectsServiceStart) {
          throw new Error('Saved Objects Start service not available');
        }

        return this.savedObjectsServiceStart;
      },
      licensing
    }; // Initialize version service with current kibana version

    _version.versionService.setup(this.kibanaVersion);

    (0, _cluster_checkup.registerClusterCheckupRoutes)(dependencies);
    (0, _deprecation_logging.registerDeprecationLoggingRoutes)(dependencies);
    (0, _reindex_indices.registerReindexIndicesRoutes)(dependencies, this.getWorker.bind(this)); // Bootstrap the needed routes and the collector for the telemetry

    (0, _telemetry2.registerTelemetryRoutes)(dependencies);
    (0, _query_default_field.registerQueryDefaultFieldRoutes)(dependencies);

    if (usageCollection) {
      getStartServices().then(([{
        savedObjects: savedObjectsService,
        elasticsearch
      }]) => {
        (0, _telemetry.registerUpgradeAssistantUsageCollector)({
          elasticsearch,
          usageCollection,
          savedObjects: savedObjectsService
        });
      });
    }
  }

  async start({
    savedObjects,
    elasticsearch
  }) {
    this.savedObjectsServiceStart = savedObjects; // The ReindexWorker uses a map of request headers that contain the authentication credentials
    // for a given reindex. We cannot currently store these in an the .kibana index b/c we do not
    // want to expose these credentials to any unauthenticated users. We also want to avoid any need
    // to add a user for a special index just for upgrading. This in-memory cache allows us to
    // process jobs without the browser staying on the page, but will require that jobs go into
    // a paused state if no Kibana nodes have the required credentials.

    const apmIndexPatterns = (0, _extract_index_patterns.extractIndexPatterns)(await this.apmOSS.config$.pipe((0, _operators.first)()).toPromise());
    this.worker = (0, _reindex_indices.createReindexWorker)({
      credentialStore: this.credentialStore,
      licensing: this.licensing,
      elasticsearchService: elasticsearch,
      logger: this.logger,
      savedObjects: new _server.SavedObjectsClient(this.savedObjectsServiceStart.createInternalRepository()),
      apmIndexPatterns
    });
    this.worker.start();
  }

  stop() {
    if (this.worker) {
      this.worker.stop();
    }
  }

}

exports.UpgradeAssistantServerPlugin = UpgradeAssistantServerPlugin;