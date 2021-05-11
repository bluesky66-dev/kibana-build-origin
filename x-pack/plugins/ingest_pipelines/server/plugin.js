"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IngestPipelinesPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");

var _services = require("./services");

var _routes = require("./routes");

var _shared_imports = require("./shared_imports");

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

class IngestPipelinesPlugin {
  constructor({
    logger
  }) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "apiRoutes", void 0);

    this.logger = logger.get();
    this.license = new _services.License();
    this.apiRoutes = new _routes.ApiRoutes();
  }

  setup({
    http
  }, {
    licensing,
    security,
    features
  }) {
    this.logger.debug('ingest_pipelines: setup');
    const router = http.createRouter();
    this.license.setup({
      pluginId: _constants.PLUGIN_ID,
      minimumLicenseType: _constants.PLUGIN_MIN_LICENSE_TYPE,
      defaultErrorMessage: _i18n.i18n.translate('xpack.ingestPipelines.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    features.registerElasticsearchFeature({
      id: 'ingest_pipelines',
      management: {
        ingest: ['ingest_pipelines']
      },
      privileges: [{
        ui: [],
        requiredClusterPrivileges: ['manage_pipeline', 'cluster:monitor/nodes/info']
      }]
    });
    this.apiRoutes.setup({
      router,
      license: this.license,
      config: {
        isSecurityEnabled: () => security !== undefined && security.license.isEnabled()
      },
      lib: {
        isEsError: _shared_imports.isEsError
      }
    });
  }

  start() {}

  stop() {}

}

exports.IngestPipelinesPlugin = IngestPipelinesPlugin;