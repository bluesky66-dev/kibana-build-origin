"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = void 0;

var _i18n = require("@kbn/i18n");

var _lruCache = _interopRequireDefault(require("lru-cache"));

var _server = require("../../../../src/core/server");

var _init_server = require("./init_server");

var _kibana = require("./lib/compose/kibana");

var _routes = require("./routes");

var _types = require("./lib/detection_engine/signals/types");

var _signal_rule_alert_type = require("./lib/detection_engine/signals/signal_rule_alert_type");

var _rules_notification_alert_type = require("./lib/detection_engine/notifications/rules_notification_alert_type");

var _types2 = require("./lib/detection_engine/notifications/types");

var _artifacts = require("./endpoint/lib/artifacts");

var _saved_objects = require("./saved_objects");

var _client = require("./client");

var _config = require("./config");

var _ui_settings = require("./ui_settings");

var _constants = require("../common/constants");

var _metadata = require("./endpoint/routes/metadata");

var _limited_concurrency = require("./endpoint/routes/limited_concurrency");

var _resolver = require("./endpoint/routes/resolver");

var _policy = require("./endpoint/routes/policy");

var _services = require("./endpoint/services");

var _endpoint_app_context_services = require("./endpoint/endpoint_app_context_services");

var _artifacts2 = require("./endpoint/routes/artifacts");

var _usage = require("./usage");

var _trusted_apps = require("./endpoint/routes/trusted_apps");

var _security_solution = require("./search_strategy/security_solution");

var _index_fields = require("./search_strategy/index_fields");

var _timeline = require("./search_strategy/timeline");

var _sender = require("./lib/telemetry/sender");

var _license = require("./lib/license/license");

var _license_watch = require("./endpoint/lib/policy/license_watch");

var _eql = require("./search_strategy/timeline/eql");

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
}

const securitySubPlugins = [_constants.APP_ID, `${_constants.APP_ID}:${_constants.SecurityPageName.overview}`, `${_constants.APP_ID}:${_constants.SecurityPageName.detections}`, `${_constants.APP_ID}:${_constants.SecurityPageName.hosts}`, `${_constants.APP_ID}:${_constants.SecurityPageName.network}`, `${_constants.APP_ID}:${_constants.SecurityPageName.timelines}`, `${_constants.APP_ID}:${_constants.SecurityPageName.case}`, `${_constants.APP_ID}:${_constants.SecurityPageName.administration}`];
const caseSavedObjects = ['cases', 'cases-comments', 'cases-sub-case', 'cases-configure', 'cases-user-actions'];

class Plugin {
  // TODO: can we create ListPluginStart?
  constructor(context) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "context", void 0);

    _defineProperty(this, "appClientFactory", void 0);

    _defineProperty(this, "setupPlugins", void 0);

    _defineProperty(this, "endpointAppContextService", new _endpoint_app_context_services.EndpointAppContextService());

    _defineProperty(this, "telemetryEventsSender", void 0);

    _defineProperty(this, "lists", void 0);

    _defineProperty(this, "licensing$", void 0);

    _defineProperty(this, "policyWatcher", void 0);

    _defineProperty(this, "manifestTask", void 0);

    _defineProperty(this, "artifactsCache", void 0);

    this.context = context;
    this.logger = context.logger.get();
    this.config = (0, _config.createConfig)(context);
    this.appClientFactory = new _client.AppClientFactory(); // Cache up to three artifacts with a max retention of 5 mins each

    this.artifactsCache = new _lruCache.default({
      max: 3,
      maxAge: 1000 * 60 * 5
    });
    this.telemetryEventsSender = new _sender.TelemetryEventsSender(this.logger);
    this.logger.debug('plugin initialized');
  }

  setup(core, plugins) {
    var _plugins$spaces, _plugins$spaces$space, _plugins$encryptedSav;

    this.logger.debug('plugin setup');
    this.setupPlugins = plugins;
    const config = this.config;
    const globalConfig = this.context.config.legacy.get();
    (0, _saved_objects.initSavedObjects)(core.savedObjects);
    (0, _ui_settings.initUiSettings)(core.uiSettings);
    (0, _usage.initUsageCollectors)({
      core,
      kibanaIndex: globalConfig.kibana.index,
      ml: plugins.ml,
      usageCollection: plugins.usageCollection
    });
    const endpointContext = {
      logFactory: this.context.logger,
      service: this.endpointAppContextService,
      config: () => Promise.resolve(config)
    };
    const router = core.http.createRouter();
    core.http.registerRouteHandlerContext(_constants.APP_ID, (context, request, response) => ({
      getAppClient: () => this.appClientFactory.create(request)
    }));
    this.appClientFactory.setup({
      getSpaceId: (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : (_plugins$spaces$space = _plugins$spaces.spacesService) === null || _plugins$spaces$space === void 0 ? void 0 : _plugins$spaces$space.getSpaceId,
      config
    }); // TO DO We need to get the endpoint routes inside of initRoutes

    (0, _routes.initRoutes)(router, config, ((_plugins$encryptedSav = plugins.encryptedSavedObjects) === null || _plugins$encryptedSav === void 0 ? void 0 : _plugins$encryptedSav.canEncrypt) === true, plugins.security, plugins.ml);
    (0, _metadata.registerEndpointRoutes)(router, endpointContext);
    (0, _limited_concurrency.registerLimitedConcurrencyRoutes)(core);
    (0, _resolver.registerResolverRoutes)(router, endpointContext);
    (0, _policy.registerPolicyRoutes)(router, endpointContext);
    (0, _trusted_apps.registerTrustedAppsRoutes)(router, endpointContext);
    (0, _artifacts2.registerDownloadArtifactRoute)(router, endpointContext, this.artifactsCache);
    plugins.features.registerKibanaFeature({
      id: _constants.SERVER_APP_ID,
      name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.linkSecuritySolutionTitle', {
        defaultMessage: 'Security'
      }),
      order: 1100,
      category: _server.DEFAULT_APP_CATEGORIES.security,
      app: [...securitySubPlugins, 'kibana'],
      catalogue: ['securitySolution'],
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      alerting: [_constants.SIGNALS_ID, _constants.NOTIFICATIONS_ID],
      privileges: {
        all: {
          app: [...securitySubPlugins, 'kibana'],
          catalogue: ['securitySolution'],
          api: ['securitySolution', 'lists-all', 'lists-read'],
          savedObject: {
            all: ['alert', ...caseSavedObjects, 'exception-list', 'exception-list-agnostic', ..._saved_objects.savedObjectTypes],
            read: ['config']
          },
          alerting: {
            all: [_constants.SIGNALS_ID, _constants.NOTIFICATIONS_ID]
          },
          management: {
            insightsAndAlerting: ['triggersActions']
          },
          ui: ['show', 'crud']
        },
        read: {
          app: [...securitySubPlugins, 'kibana'],
          catalogue: ['securitySolution'],
          api: ['securitySolution', 'lists-read'],
          savedObject: {
            all: [],
            read: ['config', ...caseSavedObjects, 'exception-list', 'exception-list-agnostic', ..._saved_objects.savedObjectTypes]
          },
          alerting: {
            read: [_constants.SIGNALS_ID, _constants.NOTIFICATIONS_ID]
          },
          management: {
            insightsAndAlerting: ['triggersActions']
          },
          ui: ['show']
        }
      }
    });

    if (plugins.alerts != null) {
      const signalRuleType = (0, _signal_rule_alert_type.signalRulesAlertType)({
        logger: this.logger,
        eventsTelemetry: this.telemetryEventsSender,
        version: this.context.env.packageInfo.version,
        ml: plugins.ml,
        lists: plugins.lists
      });
      const ruleNotificationType = (0, _rules_notification_alert_type.rulesNotificationAlertType)({
        logger: this.logger
      });

      if ((0, _types.isAlertExecutor)(signalRuleType)) {
        plugins.alerts.registerType(signalRuleType);
      }

      if ((0, _types2.isNotificationAlertExecutor)(ruleNotificationType)) {
        plugins.alerts.registerType(ruleNotificationType);
      }
    }

    const exceptionListsSetupEnabled = () => {
      return plugins.taskManager && plugins.lists;
    };

    if (exceptionListsSetupEnabled()) {
      this.lists = plugins.lists;
      this.manifestTask = new _artifacts.ManifestTask({
        endpointAppContext: endpointContext,
        taskManager: plugins.taskManager
      });
    }

    const libs = (0, _kibana.compose)(core, plugins, endpointContext);
    (0, _init_server.initServer)(libs);
    core.getStartServices().then(([_, depsStart]) => {
      const securitySolutionSearchStrategy = (0, _security_solution.securitySolutionSearchStrategyProvider)(depsStart.data);
      const securitySolutionTimelineSearchStrategy = (0, _timeline.securitySolutionTimelineSearchStrategyProvider)(depsStart.data);
      const securitySolutionTimelineEqlSearchStrategy = (0, _eql.securitySolutionTimelineEqlSearchStrategyProvider)(depsStart.data);
      const securitySolutionIndexFields = (0, _index_fields.securitySolutionIndexFieldsProvider)();
      plugins.data.search.registerSearchStrategy('securitySolutionSearchStrategy', securitySolutionSearchStrategy);
      plugins.data.search.registerSearchStrategy('securitySolutionIndexFields', securitySolutionIndexFields);
      plugins.data.search.registerSearchStrategy('securitySolutionTimelineSearchStrategy', securitySolutionTimelineSearchStrategy);
      plugins.data.search.registerSearchStrategy('securitySolutionTimelineEqlSearchStrategy', securitySolutionTimelineEqlSearchStrategy);
    });
    this.telemetryEventsSender.setup(plugins.telemetry, plugins.taskManager);
    return {};
  }

  start(core, plugins) {
    var _plugins$fleet, _plugins$fleet2, _plugins$fleet3, _plugins$fleet4, _plugins$fleet5;

    const savedObjectsClient = new _server.SavedObjectsClient(core.savedObjects.createInternalRepository());
    const registerIngestCallback = (_plugins$fleet = plugins.fleet) === null || _plugins$fleet === void 0 ? void 0 : _plugins$fleet.registerExternalCallback;
    let manifestManager;
    this.licensing$ = plugins.licensing.license$;

    if (this.lists && plugins.taskManager && plugins.fleet) {
      // Exceptions, Artifacts and Manifests start
      const exceptionListClient = this.lists.getExceptionListClient(savedObjectsClient, 'kibana');
      const artifactClient = new _services.ArtifactClient(savedObjectsClient);
      manifestManager = new _services.ManifestManager({
        savedObjectsClient,
        artifactClient,
        exceptionListClient,
        packagePolicyService: plugins.fleet.packagePolicyService,
        logger: this.logger,
        cache: this.artifactsCache
      });

      if (this.manifestTask) {
        this.manifestTask.start({
          taskManager: plugins.taskManager
        });
      } else {
        this.logger.debug('User artifacts task not available.');
      } // License related start


      _license.licenseService.start(this.licensing$);

      this.policyWatcher = new _license_watch.PolicyWatcher(plugins.fleet.packagePolicyService, core.savedObjects, core.elasticsearch, this.logger);
      this.policyWatcher.start(_license.licenseService);
    }

    this.endpointAppContextService.start({
      agentService: (_plugins$fleet2 = plugins.fleet) === null || _plugins$fleet2 === void 0 ? void 0 : _plugins$fleet2.agentService,
      packageService: (_plugins$fleet3 = plugins.fleet) === null || _plugins$fleet3 === void 0 ? void 0 : _plugins$fleet3.packageService,
      packagePolicyService: (_plugins$fleet4 = plugins.fleet) === null || _plugins$fleet4 === void 0 ? void 0 : _plugins$fleet4.packagePolicyService,
      agentPolicyService: (_plugins$fleet5 = plugins.fleet) === null || _plugins$fleet5 === void 0 ? void 0 : _plugins$fleet5.agentPolicyService,
      appClientFactory: this.appClientFactory,
      security: this.setupPlugins.security,
      alerts: plugins.alerts,
      config: this.config,
      logger: this.logger,
      manifestManager,
      registerIngestCallback,
      savedObjectsStart: core.savedObjects,
      licenseService: _license.licenseService,
      exceptionListsClient: this.lists.getExceptionListClient(savedObjectsClient, 'kibana')
    });
    this.telemetryEventsSender.start(core, plugins.telemetry, plugins.taskManager);
    return {};
  }

  stop() {
    var _this$policyWatcher;

    this.logger.debug('Stopping plugin');
    this.telemetryEventsSender.stop();
    this.endpointAppContextService.stop();
    (_this$policyWatcher = this.policyWatcher) === null || _this$policyWatcher === void 0 ? void 0 : _this$policyWatcher.stop();

    _license.licenseService.stop();
  }

}

exports.Plugin = Plugin;