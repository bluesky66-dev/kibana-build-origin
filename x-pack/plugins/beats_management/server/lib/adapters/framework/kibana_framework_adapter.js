"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaBackendFrameworkAdapter = void 0;

var _PathReporter = require("io-ts/lib/PathReporter");

var _Either = require("fp-ts/lib/Either");

var _adapter_types = require("./adapter_types");

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

class KibanaBackendFrameworkAdapter {
  constructor(PLUGIN_ID, kibanaVersion, config, logger, licensing, security) {
    this.PLUGIN_ID = PLUGIN_ID;
    this.kibanaVersion = kibanaVersion;
    this.config = config;
    this.logger = logger;
    this.licensing = licensing;
    this.security = security;

    _defineProperty(this, "internalUser", _adapter_types.internalUser);

    _defineProperty(this, "info", null);

    _defineProperty(this, "licenseUpdateHandler", license => {
      let xpackInfoUnpacked; // If, for some reason, we cannot get the license information
      // from Elasticsearch, assume worst case and disable

      if (!license.isAvailable) {
        this.info = null;
        return;
      }

      const securityFeature = license.getFeature('security');
      const watcherFeature = license.getFeature('watcher');

      try {
        var _license$expiryDateIn;

        xpackInfoUnpacked = {
          kibana: {
            version: this.kibanaVersion
          },
          license: {
            type: license.type,
            expired: !license.isActive,
            expiry_date_in_millis: (_license$expiryDateIn = license.expiryDateInMillis) !== null && _license$expiryDateIn !== void 0 ? _license$expiryDateIn : -1
          },
          security: {
            enabled: securityFeature.isEnabled,
            available: securityFeature.isAvailable
          },
          watcher: {
            enabled: watcherFeature.isEnabled,
            available: watcherFeature.isAvailable
          }
        };
      } catch (e) {
        this.logger.error(`Error accessing required xPackInfo in ${this.PLUGIN_ID} Kibana adapter`);
        throw e;
      }

      const assertData = _adapter_types.RuntimeFrameworkInfo.decode(xpackInfoUnpacked);

      if ((0, _Either.isLeft)(assertData)) {
        throw new Error(`Error parsing xpack info in ${this.PLUGIN_ID},   ${_PathReporter.PathReporter.report(assertData)[0]}`);
      }

      this.info = xpackInfoUnpacked;
      return {
        security: xpackInfoUnpacked.security,
        settings: { ...this.config
        }
      };
    });

    this.licensing.license$.subscribe(license => this.licenseUpdateHandler(license));
  }

  log(text) {
    this.logger.info(text);
  }

  getUser(request) {
    var _this$security;

    const user = (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authc.getCurrentUser(request);

    if (!user) {
      return {
        kind: 'unauthenticated'
      };
    }

    const assertKibanaUser = _adapter_types.RuntimeKibanaUser.decode(user);

    if ((0, _Either.isLeft)(assertKibanaUser)) {
      throw new Error(`Error parsing user info in ${this.PLUGIN_ID},   ${_PathReporter.PathReporter.report(assertKibanaUser)[0]}`);
    }

    return {
      kind: 'authenticated',
      [_adapter_types.internalAuthData]: request.headers,
      ...user
    };
  }

}

exports.KibanaBackendFrameworkAdapter = KibanaBackendFrameworkAdapter;