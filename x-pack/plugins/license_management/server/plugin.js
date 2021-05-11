"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseManagementServerPlugin = void 0;

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

class LicenseManagementServerPlugin {
  constructor() {
    _defineProperty(this, "apiRoutes", new _routes.ApiRoutes());
  }

  setup({
    http
  }, {
    licensing,
    features,
    security
  }) {
    const router = http.createRouter();
    features.registerElasticsearchFeature({
      id: 'license_management',
      management: {
        stack: ['license_management']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage'],
        ui: []
      }]
    });
    this.apiRoutes.setup({
      router,
      plugins: {
        licensing
      },
      lib: {
        isEsError: _shared_imports.isEsError
      },
      config: {
        isSecurityEnabled: security !== undefined
      }
    });
  }

  start() {}

  stop() {}

}

exports.LicenseManagementServerPlugin = LicenseManagementServerPlugin;