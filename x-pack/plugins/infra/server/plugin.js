"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraServerPlugin = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _inventory_view = require("../common/saved_objects/inventory_view");

var _metrics_explorer_view = require("../common/saved_objects/metrics_explorer_view");

var _features = require("./features");

var _infra_server = require("./infra_server");

var _framework_fields_adapter = require("./lib/adapters/fields/framework_fields_adapter");

var _kibana_framework_adapter = require("./lib/adapters/framework/kibana_framework_adapter");

var _kibana_log_entries_adapter = require("./lib/adapters/log_entries/kibana_log_entries_adapter");

var _kibana_metrics_adapter = require("./lib/adapters/metrics/kibana_metrics_adapter");

var _source_status = require("./lib/adapters/source_status");

var _alerting = require("./lib/alerting");

var _fields_domain = require("./lib/domains/fields_domain");

var _log_entries_domain = require("./lib/domains/log_entries_domain");

var _metrics_domain = require("./lib/domains/metrics_domain");

var _sources = require("./lib/sources");

var _source_status2 = require("./lib/source_status");

var _log_entries = require("./services/log_entries");

var _usage_collector = require("./usage/usage_collector");

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

const config = {
  schema: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    query: _configSchema.schema.object({
      partitionSize: _configSchema.schema.number({
        defaultValue: 75
      }),
      partitionFactor: _configSchema.schema.number({
        defaultValue: 1.2
      })
    }),
    sources: _configSchema.schema.maybe(_configSchema.schema.object({
      default: _configSchema.schema.maybe(_configSchema.schema.object({
        logAlias: _configSchema.schema.maybe(_configSchema.schema.string()),
        metricAlias: _configSchema.schema.maybe(_configSchema.schema.string()),
        fields: _configSchema.schema.maybe(_configSchema.schema.object({
          timestamp: _configSchema.schema.maybe(_configSchema.schema.string()),
          message: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
          tiebreaker: _configSchema.schema.maybe(_configSchema.schema.string()),
          host: _configSchema.schema.maybe(_configSchema.schema.string()),
          container: _configSchema.schema.maybe(_configSchema.schema.string()),
          pod: _configSchema.schema.maybe(_configSchema.schema.string())
        }))
      }))
    }))
  })
};
exports.config = config;

const logsSampleDataLinkLabel = _i18n.i18n.translate('xpack.infra.sampleDataLinkLabel', {
  defaultMessage: 'Logs'
});

class InfraServerPlugin {
  constructor(context) {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "libs", void 0);

    this.config = context.config.get();
  }

  setup(core, plugins) {
    const framework = new _kibana_framework_adapter.KibanaFramework(core, this.config, plugins);
    const sources = new _sources.InfraSources({
      config: this.config
    });
    const sourceStatus = new _source_status2.InfraSourceStatus(new _source_status.InfraElasticsearchSourceStatusAdapter(framework), {
      sources
    }); // register saved object types

    core.savedObjects.registerType(_sources.infraSourceConfigurationSavedObjectType);
    core.savedObjects.registerType(_metrics_explorer_view.metricsExplorerViewSavedObjectType);
    core.savedObjects.registerType(_inventory_view.inventoryViewSavedObjectType); // TODO: separate these out individually and do away with "domains" as a temporary group
    // and make them available via the request context so we can do away with
    // the wrapper classes

    const domainLibs = {
      fields: new _fields_domain.InfraFieldsDomain(new _framework_fields_adapter.FrameworkFieldsAdapter(framework), {
        sources
      }),
      logEntries: new _log_entries_domain.InfraLogEntriesDomain(new _kibana_log_entries_adapter.InfraKibanaLogEntriesAdapter(framework), {
        framework,
        sources
      }),
      metrics: new _metrics_domain.InfraMetricsDomain(new _kibana_metrics_adapter.KibanaMetricsAdapter(framework))
    };
    this.libs = {
      configuration: this.config,
      framework,
      sources,
      sourceStatus,
      ...domainLibs
    };
    plugins.features.registerKibanaFeature(_features.METRICS_FEATURE);
    plugins.features.registerKibanaFeature(_features.LOGS_FEATURE);
    plugins.home.sampleData.addAppLinksToSampleDataset('logs', [{
      path: `/app/logs`,
      label: logsSampleDataLinkLabel,
      icon: 'logsApp'
    }]);
    (0, _infra_server.initInfraServer)(this.libs);
    (0, _alerting.registerAlertTypes)(plugins.alerts, this.libs, plugins.ml);
    core.http.registerRouteHandlerContext('infra', (context, request) => {
      var _plugins$ml, _plugins$ml2, _plugins$spaces;

      const mlSystem = (_plugins$ml = plugins.ml) === null || _plugins$ml === void 0 ? void 0 : _plugins$ml.mlSystemProvider(request, context.core.savedObjects.client);
      const mlAnomalyDetectors = (_plugins$ml2 = plugins.ml) === null || _plugins$ml2 === void 0 ? void 0 : _plugins$ml2.anomalyDetectorsProvider(request, context.core.savedObjects.client);
      const spaceId = ((_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService.getSpaceId(request)) || 'default';
      return {
        mlAnomalyDetectors,
        mlSystem,
        spaceId
      };
    }); // Telemetry

    _usage_collector.UsageCollector.registerUsageCollector(plugins.usageCollection);

    const logEntriesService = new _log_entries.LogEntriesService();
    logEntriesService.setup(core, { ...plugins,
      sources
    });
    return {
      defineInternalSourceConfiguration(sourceId, sourceProperties) {
        sources.defineInternalSourceConfiguration(sourceId, sourceProperties);
      }

    };
  }

  start() {}

  stop() {}

}

exports.InfraServerPlugin = InfraServerPlugin;