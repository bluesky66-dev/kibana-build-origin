"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollupPlugin = void 0;

var _operators = require("rxjs/operators");

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

var _routes = require("./routes");

var _services = require("./services");

var _collectors = require("./collectors");

var _rollup_data_enricher = require("./rollup_data_enricher");

var _shared_imports = require("./shared_imports");

var _elasticsearch_rollup = require("./client/elasticsearch_rollup");

var _format_es_error = require("./lib/format_es_error");

var _server = require("../../../../src/plugins/data/server");

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

async function getCustomEsClient(getStartServices) {
  const [core] = await getStartServices(); // Extend the elasticsearchJs client with additional endpoints.

  const esClientConfig = {
    plugins: [_elasticsearch_rollup.elasticsearchJsPlugin]
  };
  return core.elasticsearch.legacy.createClient('rollup', esClientConfig);
}

class RollupPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "globalConfig$", void 0);

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "rollupEsClient", void 0);

    this.logger = initializerContext.logger.get();
    this.globalConfig$ = initializerContext.config.legacy.globalConfig$;
    this.license = new _services.License();
  }

  setup({
    http,
    uiSettings,
    getStartServices
  }, {
    features,
    licensing,
    indexManagement,
    visTypeTimeseries,
    usageCollection
  }) {
    this.license.setup({
      pluginId: _common.PLUGIN.ID,
      minimumLicenseType: _common.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.rollupJobs.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: 'rollup_jobs',
      management: {
        data: ['rollup_jobs']
      },
      catalogue: ['rollup_jobs'],
      privileges: [{
        requiredClusterPrivileges: ['manage_rollup'],
        ui: []
      }]
    });
    http.registerRouteHandlerContext('rollup', async (context, request) => {
      var _this$rollupEsClient;

      this.rollupEsClient = (_this$rollupEsClient = this.rollupEsClient) !== null && _this$rollupEsClient !== void 0 ? _this$rollupEsClient : await getCustomEsClient(getStartServices);
      return {
        client: this.rollupEsClient.asScoped(request)
      };
    });
    (0, _routes.registerApiRoutes)({
      router: http.createRouter(),
      license: this.license,
      lib: {
        isEsError: _shared_imports.isEsError,
        formatEsError: _format_es_error.formatEsError,
        getCapabilitiesForRollupIndices: _server.getCapabilitiesForRollupIndices
      },
      sharedImports: {
        IndexPatternsFetcher: _shared_imports.IndexPatternsFetcher
      }
    });
    uiSettings.register({
      [_common.CONFIG_ROLLUPS]: {
        name: _i18n.i18n.translate('xpack.rollupJobs.rollupIndexPatternsTitle', {
          defaultMessage: 'Enable rollup index patterns'
        }),
        value: true,
        description: _i18n.i18n.translate('xpack.rollupJobs.rollupIndexPatternsDescription', {
          defaultMessage: `Enable the creation of index patterns which capture rollup indices,
              which in turn enable visualizations based on rollup data. Refresh
              the page to apply the changes.`
        }),
        category: ['rollups'],
        schema: _configSchema.schema.boolean()
      }
    });

    if (usageCollection) {
      this.globalConfig$.pipe((0, _operators.first)()).toPromise().then(globalConfig => {
        (0, _collectors.registerRollupUsageCollector)(usageCollection, globalConfig.kibana.index);
      }).catch(e => {
        this.logger.warn(`Registering Rollup collector failed: ${e}`);
      });
    }

    if (indexManagement && indexManagement.indexDataEnricher) {
      indexManagement.indexDataEnricher.add(_rollup_data_enricher.rollupDataEnricher);
    }
  }

  start() {}

  stop() {
    if (this.rollupEsClient) {
      this.rollupEsClient.close();
    }
  }

}

exports.RollupPlugin = RollupPlugin;