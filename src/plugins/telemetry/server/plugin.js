"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryPlugin = void 0;

var _url = require("url");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../core/server");

var _routes = require("./routes");

var _telemetry_collection = require("./telemetry_collection");

var _collectors = require("./collectors");

var _fetcher = require("./fetcher");

var _handle_old_settings = require("./handle_old_settings");

var _telemetry_repository = require("./telemetry_repository");

var _telemetry_config = require("../common/telemetry_config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class TelemetryPlugin {
  /**
   * @private Used to mark the completion of the old UI Settings migration
   */
  constructor(initializerContext) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "currentKibanaVersion", void 0);

    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "isDev", void 0);

    _defineProperty(this, "fetcherTask", void 0);

    _defineProperty(this, "oldUiSettingsHandled$", new _rxjs.AsyncSubject());

    _defineProperty(this, "savedObjectsClient", void 0);

    this.logger = initializerContext.logger.get();
    this.isDev = initializerContext.env.mode.dev;
    this.currentKibanaVersion = initializerContext.env.packageInfo.version;
    this.config$ = initializerContext.config.create();
    this.fetcherTask = new _fetcher.FetcherTask({ ...initializerContext,
      logger: this.logger
    });
  }

  setup({
    http,
    savedObjects
  }, {
    usageCollection,
    telemetryCollectionManager
  }) {
    const currentKibanaVersion = this.currentKibanaVersion;
    const config$ = this.config$;
    const isDev = this.isDev;
    (0, _telemetry_collection.registerCollection)(telemetryCollectionManager);
    const router = http.createRouter();
    (0, _routes.registerRoutes)({
      config$,
      currentKibanaVersion,
      isDev,
      logger: this.logger,
      router,
      telemetryCollectionManager
    });
    this.registerMappings(opts => savedObjects.registerType(opts));
    this.registerUsageCollectors(usageCollection);
    return {
      getTelemetryUrl: async () => {
        const config = await config$.pipe((0, _operators.take)(1)).toPromise();
        return new _url.URL(config.url);
      }
    };
  }

  start(core, {
    telemetryCollectionManager
  }) {
    const {
      savedObjects,
      uiSettings
    } = core;
    const savedObjectsInternalRepository = savedObjects.createInternalRepository();
    this.savedObjectsClient = savedObjectsInternalRepository; // Not catching nor awaiting these promises because they should never reject

    this.handleOldUiSettings(uiSettings);
    this.startFetcherWhenOldSettingsAreHandled(core, telemetryCollectionManager);
    return {
      getIsOptedIn: async () => {
        await this.oldUiSettingsHandled$.pipe((0, _operators.take)(1)).toPromise(); // Wait for the old settings to be handled

        const internalRepository = new _server.SavedObjectsClient(savedObjectsInternalRepository);
        const telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(internalRepository);
        const config = await this.config$.pipe((0, _operators.take)(1)).toPromise();
        const allowChangingOptInStatus = config.allowChangingOptInStatus;
        const configTelemetryOptIn = typeof config.optIn === 'undefined' ? null : config.optIn;
        const currentKibanaVersion = this.currentKibanaVersion;
        const isOptedIn = (0, _telemetry_config.getTelemetryOptIn)({
          currentKibanaVersion,
          telemetrySavedObject,
          allowChangingOptInStatus,
          configTelemetryOptIn
        });
        return isOptedIn === true;
      }
    };
  }

  async handleOldUiSettings(uiSettings) {
    const savedObjectsClient = new _server.SavedObjectsClient(this.savedObjectsClient);
    const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);

    try {
      await (0, _handle_old_settings.handleOldSettings)(savedObjectsClient, uiSettingsClient);
    } catch (error) {
      this.logger.warn('Unable to update legacy telemetry configs.');
    } // Set the mark in the AsyncSubject as complete so all the methods that require this method to be completed before working, can move on


    this.oldUiSettingsHandled$.complete();
  }

  async startFetcherWhenOldSettingsAreHandled(core, telemetryCollectionManager) {
    await this.oldUiSettingsHandled$.pipe((0, _operators.take)(1)).toPromise(); // Wait for the old settings to be handled

    this.fetcherTask.start(core, {
      telemetryCollectionManager
    });
  }

  registerMappings(registerType) {
    registerType({
      name: 'telemetry',
      hidden: false,
      namespaceType: 'agnostic',
      mappings: {
        properties: {
          enabled: {
            type: 'boolean'
          },
          sendUsageFrom: {
            type: 'keyword'
          },
          lastReported: {
            type: 'date'
          },
          lastVersionChecked: {
            type: 'keyword'
          },
          userHasSeenNotice: {
            type: 'boolean'
          },
          reportFailureCount: {
            type: 'integer'
          },
          reportFailureVersion: {
            type: 'keyword'
          },
          allowChangingOptInStatus: {
            type: 'boolean'
          }
        }
      }
    });
  }

  registerUsageCollectors(usageCollection) {
    const getSavedObjectsClient = () => this.savedObjectsClient;

    (0, _collectors.registerTelemetryPluginUsageCollector)(usageCollection, {
      currentKibanaVersion: this.currentKibanaVersion,
      config$: this.config$,
      getSavedObjectsClient
    });
    (0, _collectors.registerTelemetryUsageCollector)(usageCollection, this.config$);
  }

}

exports.TelemetryPlugin = TelemetryPlugin;