"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaFramework = void 0;

var _i18n = require("@kbn/i18n");

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

class KibanaFramework {
  constructor(core) {
    _defineProperty(this, "router", void 0);

    _defineProperty(this, "license", void 0);

    this.router = core.http.createRouter();
  }

  setLicense(license) {
    this.license = license;
  }

  hasActiveLicense() {
    if (!this.license) {
      throw new Error("Please set license information in the plugin's setup method before trying to check the status");
    }

    return this.license.isActive;
  }

  registerRoute(config, handler) {
    // Automatically wrap all route registrations with license checking
    const wrappedHandler = async (requestContext, request, response) => {
      if (this.hasActiveLicense()) {
        return await handler(requestContext, request, response);
      } else {
        return response.forbidden({
          body: _i18n.i18n.translate('xpack.grokDebugger.serverInactiveLicenseError', {
            defaultMessage: 'The Grok Debugger tool requires an active license.'
          })
        });
      }
    };

    const routeConfig = {
      path: config.path,
      validate: config.validate
    };

    switch (config.method) {
      case 'get':
        this.router.get(routeConfig, wrappedHandler);
        break;

      case 'post':
        this.router.post(routeConfig, wrappedHandler);
        break;

      case 'delete':
        this.router.delete(routeConfig, wrappedHandler);
        break;

      case 'put':
        this.router.put(routeConfig, wrappedHandler);
        break;
    }
  }

}

exports.KibanaFramework = KibanaFramework;