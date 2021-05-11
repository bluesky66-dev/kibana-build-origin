"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingPlugin = exports.LEGACY_EVENT_LOG_ACTIONS = exports.EVENT_LOG_ACTIONS = exports.EVENT_LOG_PROVIDER = void 0;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _alert_type_registry = require("./alert_type_registry");

var _task_runner = require("./task_runner");

var _alerts_client_factory = require("./alerts_client_factory");

var _license_state = require("./lib/license_state");

var _routes = require("./routes");

var _server = require("../../licensing/server");

var _usage = require("./usage");

var _task = require("./usage/task");

var _saved_objects = require("./saved_objects");

var _task2 = require("./invalidate_pending_api_keys/task");

var _health = require("./health");

var _get_health = require("./health/get_health");

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

const EVENT_LOG_PROVIDER = 'alerting';
exports.EVENT_LOG_PROVIDER = EVENT_LOG_PROVIDER;
const EVENT_LOG_ACTIONS = {
  execute: 'execute',
  executeAction: 'execute-action',
  newInstance: 'new-instance',
  recoveredInstance: 'recovered-instance',
  activeInstance: 'active-instance'
};
exports.EVENT_LOG_ACTIONS = EVENT_LOG_ACTIONS;
const LEGACY_EVENT_LOG_ACTIONS = {
  resolvedInstance: 'resolved-instance'
};
exports.LEGACY_EVENT_LOG_ACTIONS = LEGACY_EVENT_LOG_ACTIONS;

class AlertingPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "alertTypeRegistry", void 0);

    _defineProperty(this, "taskRunnerFactory", void 0);

    _defineProperty(this, "licenseState", null);

    _defineProperty(this, "isESOCanEncrypt", void 0);

    _defineProperty(this, "security", void 0);

    _defineProperty(this, "alertsClientFactory", void 0);

    _defineProperty(this, "telemetryLogger", void 0);

    _defineProperty(this, "kibanaVersion", void 0);

    _defineProperty(this, "eventLogService", void 0);

    _defineProperty(this, "eventLogger", void 0);

    _defineProperty(this, "kibanaIndexConfig", void 0);

    _defineProperty(this, "kibanaBaseUrl", void 0);

    _defineProperty(this, "createRouteHandlerContext", core => {
      const {
        alertTypeRegistry,
        alertsClientFactory
      } = this;
      return async function alertsRouteHandlerContext(context, request) {
        const [{
          savedObjects
        }] = await core.getStartServices();
        return {
          getAlertsClient: () => {
            return alertsClientFactory.create(request, savedObjects);
          },
          listTypes: alertTypeRegistry.list.bind(alertTypeRegistry),
          getFrameworkHealth: async () => await (0, _get_health.getHealth)(savedObjects.createInternalRepository(['alert']))
        };
      };
    });

    this.config = initializerContext.config.create().pipe((0, _operators.first)()).toPromise();
    this.logger = initializerContext.logger.get('plugins', 'alerting');
    this.taskRunnerFactory = new _task_runner.TaskRunnerFactory();
    this.alertsClientFactory = new _alerts_client_factory.AlertsClientFactory();
    this.telemetryLogger = initializerContext.logger.get('usage');
    this.kibanaIndexConfig = initializerContext.config.legacy.globalConfig$;
    this.kibanaVersion = initializerContext.env.packageInfo.version;
  }

  setup(core, plugins) {
    this.kibanaBaseUrl = core.http.basePath.publicBaseUrl;
    this.licenseState = new _license_state.LicenseState(plugins.licensing.license$);
    this.security = plugins.security;
    core.capabilities.registerProvider(() => {
      return {
        management: {
          insightsAndAlerting: {
            triggersActions: true
          }
        }
      };
    });
    this.isESOCanEncrypt = plugins.encryptedSavedObjects.canEncrypt;

    if (!this.isESOCanEncrypt) {
      this.logger.warn('APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
    }

    this.eventLogger = plugins.eventLog.getLogger({
      event: {
        provider: EVENT_LOG_PROVIDER
      }
    });
    (0, _saved_objects.setupSavedObjects)(core.savedObjects, plugins.encryptedSavedObjects);
    this.eventLogService = plugins.eventLog;
    plugins.eventLog.registerProviderActions(EVENT_LOG_PROVIDER, Object.values(EVENT_LOG_ACTIONS));
    const alertTypeRegistry = new _alert_type_registry.AlertTypeRegistry({
      taskManager: plugins.taskManager,
      taskRunnerFactory: this.taskRunnerFactory,
      licenseState: this.licenseState,
      licensing: plugins.licensing
    });
    this.alertTypeRegistry = alertTypeRegistry;
    const usageCollection = plugins.usageCollection;

    if (usageCollection) {
      (0, _usage.registerAlertsUsageCollector)(usageCollection, core.getStartServices().then(([_, {
        taskManager
      }]) => taskManager));
      this.kibanaIndexConfig.subscribe(config => {
        (0, _task.initializeAlertingTelemetry)(this.telemetryLogger, core, plugins.taskManager, config.kibana.index);
      });
    }

    (0, _task2.initializeApiKeyInvalidator)(this.logger, core.getStartServices(), plugins.taskManager, this.config);
    core.getStartServices().then(async ([, startPlugins]) => {
      core.status.set((0, _rxjs.combineLatest)([core.status.derivedStatus$, (0, _health.getHealthStatusStream)(startPlugins.taskManager)]).pipe((0, _operators.map)(([derivedStatus, healthStatus]) => {
        if (healthStatus.level > derivedStatus.level) {
          return healthStatus;
        } else {
          return derivedStatus;
        }
      })));
    });
    (0, _health.initializeAlertingHealth)(this.logger, plugins.taskManager, core.getStartServices());
    core.http.registerRouteHandlerContext('alerting', this.createRouteHandlerContext(core)); // Routes

    const router = core.http.createRouter(); // Register routes

    (0, _routes.aggregateAlertRoute)(router, this.licenseState);
    (0, _routes.createAlertRoute)(router, this.licenseState);
    (0, _routes.deleteAlertRoute)(router, this.licenseState);
    (0, _routes.findAlertRoute)(router, this.licenseState);
    (0, _routes.getAlertRoute)(router, this.licenseState);
    (0, _routes.getAlertStateRoute)(router, this.licenseState);
    (0, _routes.getAlertInstanceSummaryRoute)(router, this.licenseState);
    (0, _routes.listAlertTypesRoute)(router, this.licenseState);
    (0, _routes.updateAlertRoute)(router, this.licenseState);
    (0, _routes.enableAlertRoute)(router, this.licenseState);
    (0, _routes.disableAlertRoute)(router, this.licenseState);
    (0, _routes.updateApiKeyRoute)(router, this.licenseState);
    (0, _routes.muteAllAlertRoute)(router, this.licenseState);
    (0, _routes.unmuteAllAlertRoute)(router, this.licenseState);
    (0, _routes.muteAlertInstanceRoute)(router, this.licenseState);
    (0, _routes.unmuteAlertInstanceRoute)(router, this.licenseState);
    (0, _routes.healthRoute)(router, this.licenseState, plugins.encryptedSavedObjects);
    return {
      registerType(alertType) {
        if (!(alertType.minimumLicenseRequired in _server.LICENSE_TYPE)) {
          throw new Error(`"${alertType.minimumLicenseRequired}" is not a valid license type`);
        }

        alertTypeRegistry.register(alertType);
      }

    };
  }

  start(core, plugins) {
    const {
      isESOCanEncrypt,
      logger,
      taskRunnerFactory,
      alertTypeRegistry,
      alertsClientFactory,
      security,
      licenseState
    } = this;
    licenseState === null || licenseState === void 0 ? void 0 : licenseState.setNotifyUsage(plugins.licensing.featureUsage.notifyUsage);
    const encryptedSavedObjectsClient = plugins.encryptedSavedObjects.getClient({
      includedHiddenTypes: ['alert']
    });

    const spaceIdToNamespace = spaceId => {
      return plugins.spaces && spaceId ? plugins.spaces.spacesService.spaceIdToNamespace(spaceId) : undefined;
    };

    alertsClientFactory.initialize({
      alertTypeRegistry: alertTypeRegistry,
      logger,
      taskManager: plugins.taskManager,
      securityPluginSetup: security,
      securityPluginStart: plugins.security,
      encryptedSavedObjectsClient,
      spaceIdToNamespace,

      getSpaceId(request) {
        var _plugins$spaces;

        return (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService.getSpaceId(request);
      },

      async getSpace(request) {
        var _plugins$spaces2;

        return (_plugins$spaces2 = plugins.spaces) === null || _plugins$spaces2 === void 0 ? void 0 : _plugins$spaces2.spacesService.getActiveSpace(request);
      },

      actions: plugins.actions,
      features: plugins.features,
      eventLog: plugins.eventLog,
      kibanaVersion: this.kibanaVersion
    });

    const getAlertsClientWithRequest = request => {
      if (isESOCanEncrypt !== true) {
        throw new Error(`Unable to create alerts client because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
      }

      return alertsClientFactory.create(request, core.savedObjects);
    };

    taskRunnerFactory.initialize({
      logger,
      getServices: this.getServicesFactory(core.savedObjects, core.elasticsearch),
      getAlertsClientWithRequest,
      spaceIdToNamespace,
      actionsPlugin: plugins.actions,
      encryptedSavedObjectsClient,
      basePathService: core.http.basePath,
      eventLogger: this.eventLogger,
      internalSavedObjectsRepository: core.savedObjects.createInternalRepository(['alert']),
      alertTypeRegistry: this.alertTypeRegistry,
      kibanaBaseUrl: this.kibanaBaseUrl
    });
    this.eventLogService.registerSavedObjectProvider('alert', request => {
      const client = getAlertsClientWithRequest(request);
      return objects => objects ? Promise.all(objects.map(async objectItem => await client.get({
        id: objectItem.id
      }))) : Promise.resolve([]);
    });
    (0, _task.scheduleAlertingTelemetry)(this.telemetryLogger, plugins.taskManager);
    (0, _health.scheduleAlertingHealthCheck)(this.logger, this.config, plugins.taskManager);
    (0, _task2.scheduleApiKeyInvalidatorTask)(this.telemetryLogger, this.config, plugins.taskManager);
    return {
      listTypes: alertTypeRegistry.list.bind(this.alertTypeRegistry),
      getAlertsClientWithRequest,
      getFrameworkHealth: async () => await (0, _get_health.getHealth)(core.savedObjects.createInternalRepository(['alert']))
    };
  }

  getServicesFactory(savedObjects, elasticsearch) {
    return request => ({
      callCluster: elasticsearch.legacy.client.asScoped(request).callAsCurrentUser,
      savedObjectsClient: this.getScopedClientWithAlertSavedObjectType(savedObjects, request),
      scopedClusterClient: elasticsearch.client.asScoped(request).asCurrentUser,

      getLegacyScopedClusterClient(clusterClient) {
        return clusterClient.asScoped(request);
      }

    });
  }

  getScopedClientWithAlertSavedObjectType(savedObjects, request) {
    return savedObjects.getScopedClient(request, {
      includedHiddenTypes: ['alert', 'action']
    });
  }

  stop() {
    if (this.licenseState) {
      this.licenseState.clean();
    }
  }

}

exports.AlertingPlugin = AlertingPlugin;