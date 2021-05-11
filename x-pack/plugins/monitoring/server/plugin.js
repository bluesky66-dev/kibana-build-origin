"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitoringPlugin = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _server = require("../../../../src/core/server");

var _constants = require("../common/constants");

var _config = require("./config");

var _routes = require("./routes");

var _kibana_monitoring = require("./kibana_monitoring");

var _init_infra_source = require("./lib/logs/init_infra_source");

var _mb_safe_query = require("./lib/mb_safe_query");

var _instantiate_client = require("./es_client/instantiate_client");

var _collectors = require("./kibana_monitoring/collectors");

var _telemetry_collection = require("./telemetry_collection");

var _license_service = require("./license_service");

var _alerts = require("./alerts");

var _core_services = require("./core_services");

var _static_globals = require("./static_globals");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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
} // This is used to test the version of kibana


const snapshotRegex = /-snapshot/i;

const wrapError = error => {
  var _error$statusCode;

  const options = {
    statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500
  };
  const boom = _boom.default.isBoom(error) ? error : _boom.default.boomify(error, options);
  return {
    body: boom,
    headers: boom.output.headers,
    statusCode: boom.output.statusCode
  };
};

class MonitoringPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "initializerContext", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "getLogger", void 0);

    _defineProperty(this, "cluster", {});

    _defineProperty(this, "licenseService", {});

    _defineProperty(this, "monitoringCore", {});

    _defineProperty(this, "legacyShimDependencies", {});

    _defineProperty(this, "bulkUploader", void 0);

    this.initializerContext = initializerContext;
    this.log = initializerContext.logger.get(_constants.LOGGING_TAG);

    this.getLogger = (...scopes) => initializerContext.logger.get(_constants.LOGGING_TAG, ...scopes);
  }

  setup(core, plugins) {
    var _plugins$usageCollect;

    const config = (0, _config.createConfig)(this.initializerContext.config.get());
    const legacyConfig = this.initializerContext.config.legacy.get();

    _core_services.CoreServices.init(core);

    const router = core.http.createRouter();
    this.legacyShimDependencies = {
      router,
      instanceUuid: this.initializerContext.env.instanceUuid,
      esDataClient: core.elasticsearch.legacy.client,
      kibanaStatsCollector: (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.getCollectorByType(_constants.KIBANA_STATS_TYPE_MONITORING)
    }; // Monitoring creates and maintains a connection to a potentially
    // separate ES cluster - create this first

    const cluster = this.cluster = (0, _instantiate_client.instantiateClient)(config.ui.elasticsearch, this.log, core.elasticsearch.legacy.createClient); // Start our license service which will ensure
    // the appropriate licenses are present

    this.licenseService = new _license_service.LicenseService().setup({
      licensing: plugins.licensing,
      monitoringClient: cluster,
      config,
      log: this.log
    });

    _static_globals.Globals.init(core, plugins.cloud, cluster, config, this.getLogger);

    const serverInfo = core.http.getServerInfo();

    const alerts = _alerts.AlertsFactory.getAll();

    for (const alert of alerts) {
      var _plugins$alerts;

      (_plugins$alerts = plugins.alerts) === null || _plugins$alerts === void 0 ? void 0 : _plugins$alerts.registerType(alert.getAlertType());
    } // Register collector objects for stats to show up in the APIs


    if (plugins.usageCollection) {
      core.savedObjects.registerType({
        name: _constants.SAVED_OBJECT_TELEMETRY,
        hidden: true,
        namespaceType: 'agnostic',
        mappings: {
          properties: {
            reportedClusterUuids: {
              type: 'keyword'
            }
          }
        }
      });
      (0, _collectors.registerCollectors)(plugins.usageCollection, config, cluster);
      (0, _telemetry_collection.registerMonitoringTelemetryCollection)(plugins.usageCollection, cluster, config.ui.max_bucket_size);
    } // Always create the bulk uploader


    const kibanaMonitoringLog = this.getLogger(_constants.KIBANA_MONITORING_LOGGING_TAG);
    const bulkUploader = this.bulkUploader = (0, _kibana_monitoring.initBulkUploader)({
      config,
      log: kibanaMonitoringLog,
      opsMetrics$: core.metrics.getOpsMetrics$(),
      statusGetter$: core.status.overall$,
      kibanaStats: {
        uuid: this.initializerContext.env.instanceUuid,
        name: serverInfo.name,
        index: (0, _lodash.get)(legacyConfig, 'kibana.index'),
        host: serverInfo.hostname,
        locale: _i18n.i18n.getLocale(),
        port: serverInfo.port.toString(),
        transport_address: `${serverInfo.hostname}:${serverInfo.port}`,
        version: this.initializerContext.env.packageInfo.version,
        snapshot: snapshotRegex.test(this.initializerContext.env.packageInfo.version)
      }
    }); // If the UI is enabled, then we want to register it so it shows up
    // and start any other UI-related setup tasks

    if (config.ui.enabled) {
      // Create our shim which is currently used to power our routing
      this.monitoringCore = this.getLegacyShim(config, legacyConfig, core.getStartServices, this.licenseService, this.cluster, plugins);
      this.registerPluginInUI(plugins);
      (0, _routes.requireUIRoutes)(this.monitoringCore, {
        cluster,
        router,
        licenseService: this.licenseService,
        encryptedSavedObjects: plugins.encryptedSavedObjects,
        logger: this.log
      });
      (0, _init_infra_source.initInfraSource)(config, plugins.infra);
    }

    return {
      // OSS stats api needs to call this in order to centralize how
      // we fetch kibana specific stats
      getKibanaStats: () => bulkUploader.getKibanaStats()
    };
  }

  start(core, {
    licensing
  }) {
    const config = (0, _config.createConfig)(this.initializerContext.config.get()); // If collection is enabled, start it

    const kibanaMonitoringLog = this.getLogger(_constants.KIBANA_MONITORING_LOGGING_TAG);
    const kibanaCollectionEnabled = config.kibana.collection.enabled;

    if (kibanaCollectionEnabled) {
      // Do not use `this.licenseService` as that looks at the monitoring cluster
      // whereas we want to check the production cluster here
      if (this.bulkUploader && licensing) {
        licensing.license$.subscribe(license => {
          // use updated xpack license info to start/stop bulk upload
          const mainMonitoring = license.getFeature('monitoring');
          const monitoringBulkEnabled = mainMonitoring && mainMonitoring.isAvailable && mainMonitoring.isEnabled;

          if (monitoringBulkEnabled) {
            var _this$bulkUploader;

            (_this$bulkUploader = this.bulkUploader) === null || _this$bulkUploader === void 0 ? void 0 : _this$bulkUploader.start(core.elasticsearch.client.asInternalUser);
          } else {
            var _this$bulkUploader2;

            (_this$bulkUploader2 = this.bulkUploader) === null || _this$bulkUploader2 === void 0 ? void 0 : _this$bulkUploader2.handleNotEnabled();
          }
        });
      } else {
        kibanaMonitoringLog.warn('Internal collection for Kibana monitoring is disabled due to missing license information.');
      }
    } else {
      kibanaMonitoringLog.info('Internal collection for Kibana monitoring is disabled per configuration.');
    }
  }

  stop() {
    var _this$bulkUploader3;

    if (this.cluster) {
      this.cluster.close();
    }

    if (this.licenseService) {
      this.licenseService.stop();
    }

    (_this$bulkUploader3 = this.bulkUploader) === null || _this$bulkUploader3 === void 0 ? void 0 : _this$bulkUploader3.stop();
  }

  registerPluginInUI(plugins) {
    plugins.features.registerKibanaFeature({
      id: 'monitoring',
      name: _i18n.i18n.translate('xpack.monitoring.featureRegistry.monitoringFeatureName', {
        defaultMessage: 'Stack Monitoring'
      }),
      category: _server.DEFAULT_APP_CATEGORIES.management,
      app: ['monitoring', 'kibana'],
      catalogue: ['monitoring'],
      privileges: null,
      alerting: _constants.ALERTS,
      reserved: {
        description: _i18n.i18n.translate('xpack.monitoring.feature.reserved.description', {
          defaultMessage: 'To grant users access, you should also assign the monitoring_user role.'
        }),
        privileges: [{
          id: 'monitoring',
          privilege: {
            app: ['monitoring', 'kibana'],
            catalogue: ['monitoring'],
            savedObject: {
              all: [],
              read: []
            },
            alerting: {
              all: _constants.ALERTS
            },
            ui: []
          }
        }]
      }
    });
  }

  getLegacyShim(config, legacyConfig, getCoreServices, licenseService, cluster, setupPlugins) {
    const router = this.legacyShimDependencies.router;

    const legacyConfigWrapper = () => ({
      get: _key => {
        const key = _key.includes('monitoring.') ? _key.split('monitoring.')[1] : _key;

        if ((0, _lodash.has)(config, key)) {
          return (0, _lodash.get)(config, key);
        }

        if ((0, _lodash.has)(legacyConfig, key)) {
          return (0, _lodash.get)(legacyConfig, key);
        }

        if (key === 'server.uuid') {
          return this.legacyShimDependencies.instanceUuid;
        }

        throw new Error(`Unknown key '${_key}'`);
      }
    });

    return {
      config: legacyConfigWrapper,
      log: this.log,
      route: options => {
        const method = options.method;

        const handler = async (context, req, res) => {
          const plugins = (await getCoreServices())[1];
          const legacyRequest = { ...req,
            logger: this.log,
            getLogger: this.getLogger,
            payload: req.body,
            getKibanaStatsCollector: () => this.legacyShimDependencies.kibanaStatsCollector,
            getUiSettingsService: () => context.core.uiSettings.client,
            getActionTypeRegistry: () => {
              var _context$actions;

              return (_context$actions = context.actions) === null || _context$actions === void 0 ? void 0 : _context$actions.listTypes();
            },
            getAlertsClient: () => {
              try {
                return plugins.alerts.getAlertsClientWithRequest(req);
              } catch (err) {
                // If security is disabled, this call will throw an error unless a certain config is set for dist builds
                return null;
              }
            },
            getActionsClient: () => {
              try {
                return plugins.actions.getActionsClientWithRequest(req);
              } catch (err) {
                // If security is disabled, this call will throw an error unless a certain config is set for dist builds
                return null;
              }
            },
            server: {
              route: () => {},
              config: legacyConfigWrapper,
              newPlatform: {
                setup: {
                  plugins: setupPlugins
                }
              },
              plugins: {
                monitoring: {
                  info: licenseService
                },
                elasticsearch: {
                  getCluster: name => ({
                    callWithRequest: async (_req, endpoint, params) => {
                      const client = name === 'monitoring' ? cluster : this.legacyShimDependencies.esDataClient;
                      return (0, _mb_safe_query.mbSafeQuery)(() => client.asScoped(req).callAsCurrentUser(endpoint, params));
                    }
                  })
                }
              }
            }
          };

          try {
            const result = await options.handler(legacyRequest);
            return res.ok({
              body: result
            });
          } catch (err) {
            var _err$output;

            const statusCode = ((_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) || err.statusCode || err.status || 500;

            if (_boom.default.isBoom(err) || statusCode !== 500) {
              return res.customError({
                statusCode,
                body: err
              });
            }

            return res.internalError(wrapError(err));
          }
        };

        const validate = (0, _lodash.get)(options, 'config.validate', false);

        if (validate && validate.payload) {
          validate.body = validate.payload;
        }

        options.validate = validate;

        if (method === 'POST') {
          router.post(options, handler);
        } else if (method === 'GET') {
          router.get(options, handler);
        } else if (method === 'PUT') {
          router.put(options, handler);
        } else {
          throw new Error('Unsupport API method: ' + method);
        }
      }
    };
  }

}

exports.MonitoringPlugin = MonitoringPlugin;