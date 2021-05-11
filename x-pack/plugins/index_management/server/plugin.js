"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexMgmtServerPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _plugin = require("../common/constants/plugin");

var _routes = require("./routes");

var _services = require("./services");

var _shared_imports = require("./shared_imports");

var _elasticsearch = require("./client/elasticsearch");

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
    plugins: [_elasticsearch.elasticsearchJsPlugin]
  };
  return core.elasticsearch.legacy.createClient('dataManagement', esClientConfig);
}

class IndexMgmtServerPlugin {
  constructor(initContext) {
    _defineProperty(this, "apiRoutes", void 0);

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "indexDataEnricher", void 0);

    _defineProperty(this, "dataManagementESClient", void 0);

    this.logger = initContext.logger.get();
    this.apiRoutes = new _routes.ApiRoutes();
    this.license = new _services.License();
    this.indexDataEnricher = new _services.IndexDataEnricher();
  }

  setup({
    http,
    getStartServices
  }, {
    features,
    licensing,
    security
  }) {
    const router = http.createRouter();
    this.license.setup({
      pluginId: _plugin.PLUGIN.id,
      minimumLicenseType: _plugin.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.idxMgmt.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: _plugin.PLUGIN.id,
      management: {
        data: ['index_management']
      },
      privileges: [{
        // manage_index_templates is also required, but we will disable specific parts of the
        // UI if this privilege is missing.
        requiredClusterPrivileges: ['monitor'],
        ui: []
      }]
    });
    http.registerRouteHandlerContext('dataManagement', async (ctx, request) => {
      var _this$dataManagementE;

      this.dataManagementESClient = (_this$dataManagementE = this.dataManagementESClient) !== null && _this$dataManagementE !== void 0 ? _this$dataManagementE : await getCustomEsClient(getStartServices);
      return {
        client: this.dataManagementESClient.asScoped(request)
      };
    });
    this.apiRoutes.setup({
      router,
      license: this.license,
      config: {
        isSecurityEnabled: () => security !== undefined && security.license.isEnabled()
      },
      indexDataEnricher: this.indexDataEnricher,
      lib: {
        isEsError: _shared_imports.isEsError,
        parseEsError: _shared_imports.parseEsError,
        handleEsError: _shared_imports.handleEsError
      }
    });
    return {
      indexDataEnricher: {
        add: this.indexDataEnricher.add.bind(this.indexDataEnricher)
      }
    };
  }

  start() {}

  stop() {
    if (this.dataManagementESClient) {
      this.dataManagementESClient.close();
    }
  }

}

exports.IndexMgmtServerPlugin = IndexMgmtServerPlugin;