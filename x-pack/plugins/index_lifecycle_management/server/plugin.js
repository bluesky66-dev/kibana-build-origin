"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexLifecycleManagementServerPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _shared_imports = require("./shared_imports");

var _constants = require("../common/constants");

var _routes = require("./routes");

var _services = require("./services");

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

const indexLifecycleDataEnricher = async (indicesList, callAsCurrentUser) => {
  if (!indicesList || !indicesList.length) {
    return [];
  }

  const params = {
    path: '/*/_ilm/explain',
    method: 'GET'
  };
  const {
    indices: ilmIndicesData
  } = await callAsCurrentUser('transport.request', params);
  return indicesList.map(index => {
    return { ...index,
      ilm: { ...(ilmIndicesData[index.name] || {})
      }
    };
  });
};

class IndexLifecycleManagementServerPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "logger", void 0);

    this.logger = initializerContext.logger.get();
    this.config = initializerContext.config.get();
    this.license = new _services.License();
  }

  setup({
    http
  }, {
    licensing,
    indexManagement,
    features
  }) {
    const router = http.createRouter();
    const config = this.config;
    this.license.setup({
      pluginId: _constants.PLUGIN.ID,
      minimumLicenseType: _constants.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.indexLifecycleMgmt.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: _constants.PLUGIN.ID,
      management: {
        data: [_constants.PLUGIN.ID]
      },
      catalogue: [_constants.PLUGIN.ID],
      privileges: [{
        requiredClusterPrivileges: ['manage_ilm'],
        ui: []
      }]
    });
    (0, _routes.registerApiRoutes)({
      router,
      config,
      license: this.license,
      lib: {
        handleEsError: _shared_imports.handleEsError
      }
    });

    if (config.ui.enabled) {
      if (indexManagement && indexManagement.indexDataEnricher) {
        indexManagement.indexDataEnricher.add(indexLifecycleDataEnricher);
      }
    }
  }

  start() {}

  stop() {}

}

exports.IndexLifecycleManagementServerPlugin = IndexLifecycleManagementServerPlugin;