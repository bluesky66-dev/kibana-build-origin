"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrossClusterReplicationServerPlugin = void 0;

var _operators = require("rxjs/operators");

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");

var _routes = require("./routes");

var _services = require("./services");

var _elasticsearch_ccr = require("./client/elasticsearch_ccr");

var _shared_imports = require("./shared_imports");

var _format_es_error = require("./lib/format_es_error");

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
    plugins: [_elasticsearch_ccr.elasticsearchJsPlugin]
  };
  return core.elasticsearch.legacy.createClient('crossClusterReplication', esClientConfig);
}

const ccrDataEnricher = async (indicesList, callWithRequest) => {
  if (!(indicesList !== null && indicesList !== void 0 && indicesList.length)) {
    return indicesList;
  }

  const params = {
    path: '/_all/_ccr/info',
    method: 'GET'
  };

  try {
    const {
      follower_indices: followerIndices
    } = await callWithRequest('transport.request', params);
    return indicesList.map(index => {
      const isFollowerIndex = !!followerIndices.find(followerIndex => {
        return followerIndex.follower_index === index.name;
      });
      return { ...index,
        isFollowerIndex
      };
    });
  } catch (e) {
    return indicesList;
  }
};

class CrossClusterReplicationServerPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "ccrEsClient", void 0);

    this.logger = initializerContext.logger.get();
    this.config$ = initializerContext.config.create();
    this.license = new _services.License();
  }

  setup({
    http,
    getStartServices
  }, {
    features,
    licensing,
    indexManagement,
    remoteClusters
  }) {
    this.config$.pipe((0, _operators.first)()).toPromise().then(config => {
      // remoteClusters.isUiEnabled is driven by the xpack.remote_clusters.ui.enabled setting.
      // The CCR UI depends upon the Remote Clusters UI (e.g. by cross-linking to it), so if
      // the Remote Clusters UI is disabled we can't show the CCR UI.
      const isCcrUiEnabled = config.ui.enabled && remoteClusters.isUiEnabled; // If the UI isn't enabled, then we don't want to expose any CCR concepts in the UI, including
      // "follower" badges for follower indices.

      if (isCcrUiEnabled) {
        if (indexManagement.indexDataEnricher) {
          indexManagement.indexDataEnricher.add(ccrDataEnricher);
        }
      }
    });
    this.license.setup({
      pluginId: _constants.PLUGIN.ID,
      minimumLicenseType: _constants.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.crossClusterReplication.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: 'cross_cluster_replication',
      management: {
        data: ['cross_cluster_replication']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage', 'manage_ccr'],
        ui: []
      }]
    });
    http.registerRouteHandlerContext('crossClusterReplication', async (ctx, request) => {
      var _this$ccrEsClient;

      this.ccrEsClient = (_this$ccrEsClient = this.ccrEsClient) !== null && _this$ccrEsClient !== void 0 ? _this$ccrEsClient : await getCustomEsClient(getStartServices);
      return {
        client: this.ccrEsClient.asScoped(request)
      };
    });
    (0, _routes.registerApiRoutes)({
      router: http.createRouter(),
      license: this.license,
      lib: {
        isEsError: _shared_imports.isEsError,
        formatEsError: _format_es_error.formatEsError
      }
    });
  }

  start() {}

  stop() {
    if (this.ccrEsClient) {
      this.ccrEsClient.close();
    }
  }

}

exports.CrossClusterReplicationServerPlugin = CrossClusterReplicationServerPlugin;