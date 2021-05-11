"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APMPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _index = require("./index");

var _common = require("../../../../src/plugins/data/common");

var _feature = require("./feature");

var _register_apm_alerts = require("./lib/alerts/register_apm_alerts");

var _apm_telemetry = require("./lib/apm_telemetry");

var _create_apm_event_client = require("./lib/helpers/create_es_client/create_apm_event_client");

var _get_internal_saved_objects_client = require("./lib/helpers/get_internal_saved_objects_client");

var _create_agent_config_index = require("./lib/settings/agent_configuration/create_agent_config_index");

var _get_apm_indices = require("./lib/settings/apm_indices/get_apm_indices");

var _create_custom_link_index = require("./lib/settings/custom_link/create_custom_link_index");

var _create_apm_api = require("./routes/create_apm_api");

var _saved_objects = require("./saved_objects");

var _elastic_cloud = require("./tutorial/elastic_cloud");

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

class APMPlugin {
  constructor(initContext) {
    this.initContext = initContext;

    _defineProperty(this, "currentConfig", void 0);

    _defineProperty(this, "logger", void 0);

    this.initContext = initContext;
  }

  setup(core, plugins) {
    this.logger = this.initContext.logger.get();
    const config$ = this.initContext.config.create();
    const mergedConfig$ = (0, _rxjs.combineLatest)(plugins.apmOss.config$, config$).pipe((0, _operators.map)(([apmOssConfig, apmConfig]) => (0, _index.mergeConfigs)(apmOssConfig, apmConfig)));
    core.savedObjects.registerType(_saved_objects.apmIndices);
    core.savedObjects.registerType(_saved_objects.apmTelemetry);
    core.uiSettings.register(_ui_settings.uiSettings);

    if (plugins.actions && plugins.alerts) {
      (0, _register_apm_alerts.registerApmAlerts)({
        alerts: plugins.alerts,
        actions: plugins.actions,
        ml: plugins.ml,
        config$: mergedConfig$
      });
    }

    this.currentConfig = (0, _index.mergeConfigs)(plugins.apmOss.config, this.initContext.config.get());

    if (plugins.taskManager && plugins.usageCollection && this.currentConfig['xpack.apm.telemetryCollectionEnabled']) {
      (0, _apm_telemetry.createApmTelemetry)({
        core,
        config$: mergedConfig$,
        usageCollector: plugins.usageCollection,
        taskManager: plugins.taskManager,
        logger: this.logger,
        kibanaVersion: this.initContext.env.packageInfo.version
      });
    }

    const ossTutorialProvider = plugins.apmOss.getRegisteredTutorialProvider();
    plugins.home.tutorials.unregisterTutorial(ossTutorialProvider);
    plugins.home.tutorials.registerTutorial(() => {
      const ossPart = ossTutorialProvider({});

      if (this.currentConfig['xpack.apm.ui.enabled'] && ossPart.artifacts) {
        ossPart.artifacts.application = {
          path: '/app/apm',
          label: _i18n.i18n.translate('xpack.apm.tutorial.specProvider.artifacts.application.label', {
            defaultMessage: 'Launch APM'
          })
        };
      }

      return { ...ossPart,
        elasticCloud: (0, _elastic_cloud.createElasticCloudInstructions)(plugins.cloud)
      };
    });
    plugins.features.registerKibanaFeature(_feature.APM_FEATURE);
    (0, _feature.registerFeaturesUsage)({
      licensingPlugin: plugins.licensing
    });
    (0, _create_apm_api.createApmApi)().init(core, {
      config$: mergedConfig$,
      logger: this.logger,
      plugins: {
        observability: plugins.observability,
        security: plugins.security,
        ml: plugins.ml
      }
    });

    const boundGetApmIndices = async () => (0, _get_apm_indices.getApmIndices)({
      savedObjectsClient: await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core),
      config: await mergedConfig$.pipe((0, _operators.take)(1)).toPromise()
    });

    return {
      config$: mergedConfig$,
      getApmIndices: boundGetApmIndices,
      createApmEventClient: async ({
        request,
        context,
        debug
      }) => {
        const [indices, includeFrozen] = await Promise.all([boundGetApmIndices(), context.core.uiSettings.client.get(_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN)]);
        const esClient = context.core.elasticsearch.client.asCurrentUser;
        return (0, _create_apm_event_client.createApmEventClient)({
          debug: debug !== null && debug !== void 0 ? debug : false,
          esClient,
          request,
          indices,
          options: {
            includeFrozen
          }
        });
      }
    };
  }

  start(core) {
    if (this.currentConfig == null || this.logger == null) {
      throw new Error('APMPlugin needs to be setup before calling start()');
    } // create agent configuration index without blocking start lifecycle


    (0, _create_agent_config_index.createApmAgentConfigurationIndex)({
      client: core.elasticsearch.client.asInternalUser,
      config: this.currentConfig,
      logger: this.logger
    }); // create custom action index without blocking start lifecycle

    (0, _create_custom_link_index.createApmCustomLinkIndex)({
      client: core.elasticsearch.client.asInternalUser,
      config: this.currentConfig,
      logger: this.logger
    });
  }

  stop() {}

}

exports.APMPlugin = APMPlugin;