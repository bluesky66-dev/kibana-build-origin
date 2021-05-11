"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnapshotRestoreServerPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../common");

var _services = require("./services");

var _routes = require("./routes");

var _lib = require("./lib");

var _shared_imports = require("./shared_imports");

var _elasticsearch_sr = require("./client/elasticsearch_sr");

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
  const [core] = await getStartServices();
  const esClientConfig = {
    plugins: [_elasticsearch_sr.elasticsearchJsPlugin]
  };
  return core.elasticsearch.legacy.createClient('snapshotRestore', esClientConfig);
}

class SnapshotRestoreServerPlugin {
  constructor(context) {
    this.context = context;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "apiRoutes", void 0);

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "snapshotRestoreESClient", void 0);

    const {
      logger
    } = this.context;
    this.logger = logger.get();
    this.apiRoutes = new _routes.ApiRoutes();
    this.license = new _services.License();
  }

  setup({
    http,
    getStartServices
  }, {
    licensing,
    features,
    security,
    cloud
  }) {
    const pluginConfig = this.context.config.get();

    if (!pluginConfig.enabled) {
      return;
    }

    const router = http.createRouter();
    this.license.setup({
      pluginId: _common.PLUGIN.id,
      minimumLicenseType: _common.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.snapshotRestore.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: _common.PLUGIN.id,
      management: {
        data: [_common.PLUGIN.id]
      },
      catalogue: [_common.PLUGIN.id],
      privileges: [{
        requiredClusterPrivileges: [..._common.APP_REQUIRED_CLUSTER_PRIVILEGES],
        ui: []
      }]
    });
    http.registerRouteHandlerContext('snapshotRestore', async (ctx, request) => {
      var _this$snapshotRestore;

      this.snapshotRestoreESClient = (_this$snapshotRestore = this.snapshotRestoreESClient) !== null && _this$snapshotRestore !== void 0 ? _this$snapshotRestore : await getCustomEsClient(getStartServices);
      return {
        client: this.snapshotRestoreESClient.asScoped(request)
      };
    });
    this.apiRoutes.setup({
      router,
      license: this.license,
      config: {
        isSecurityEnabled: () => security !== undefined && security.license.isEnabled(),
        isCloudEnabled: cloud !== undefined && cloud.isCloudEnabled,
        isSlmEnabled: pluginConfig.slm_ui.enabled
      },
      lib: {
        isEsError: _shared_imports.isEsError,
        wrapEsError: _lib.wrapEsError
      }
    });
  }

  start() {}

  stop() {
    if (this.snapshotRestoreESClient) {
      this.snapshotRestoreESClient.close();
    }
  }

}

exports.SnapshotRestoreServerPlugin = SnapshotRestoreServerPlugin;