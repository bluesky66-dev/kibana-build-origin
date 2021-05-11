"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoteClustersServerPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");

var _api = require("./routes/api");

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

class RemoteClustersServerPlugin {
  constructor({
    logger,
    config
  }) {
    _defineProperty(this, "licenseStatus", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "config", void 0);

    this.log = logger.get();
    this.config = config.get();
    this.licenseStatus = {
      valid: false
    };
  }

  setup({
    http
  }, {
    features,
    licensing,
    cloud
  }) {
    const router = http.createRouter();
    const routeDependencies = {
      router,
      getLicenseStatus: () => this.licenseStatus,
      config: {
        isCloudEnabled: Boolean(cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled)
      }
    };
    features.registerElasticsearchFeature({
      id: 'remote_clusters',
      management: {
        data: ['remote_clusters']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage'],
        ui: []
      }]
    }); // Register routes

    (0, _api.registerGetRoute)(routeDependencies);
    (0, _api.registerAddRoute)(routeDependencies);
    (0, _api.registerUpdateRoute)(routeDependencies);
    (0, _api.registerDeleteRoute)(routeDependencies);
    licensing.license$.subscribe(license => {
      const {
        state,
        message
      } = license.check(_constants.PLUGIN.getI18nName(), _constants.PLUGIN.minimumLicenseType);
      const hasRequiredLicense = state === 'valid';

      if (hasRequiredLicense) {
        this.licenseStatus = {
          valid: true
        };
      } else {
        this.licenseStatus = {
          valid: false,
          message: message || _i18n.i18n.translate('xpack.remoteClusters.licenseCheckErrorMessage', {
            defaultMessage: 'License check failed'
          })
        };

        if (message) {
          this.log.info(message);
        }
      }
    });
    return {
      isUiEnabled: this.config.ui.enabled
    };
  }

  start() {}

  stop() {}

}

exports.RemoteClustersServerPlugin = RemoteClustersServerPlugin;