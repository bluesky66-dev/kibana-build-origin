"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.License = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("./types");

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
/**
 * @public
 */


class License {
  /**
   * @internal
   * Generate a License instance from json representation.
   */
  static fromJSON(json) {
    return new License(json);
  }

  constructor({
    license,
    features,
    error,
    signature
  }) {
    _defineProperty(this, "license", void 0);

    _defineProperty(this, "features", void 0);

    _defineProperty(this, "error", void 0);

    _defineProperty(this, "isActive", void 0);

    _defineProperty(this, "isAvailable", void 0);

    _defineProperty(this, "uid", void 0);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "expiryDateInMillis", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "mode", void 0);

    _defineProperty(this, "signature", void 0);

    this.isAvailable = Boolean(license);
    this.license = license;
    this.features = features;
    this.error = error;
    this.signature = signature;

    if (license) {
      this.uid = license.uid;
      this.status = license.status;
      this.expiryDateInMillis = license.expiryDateInMillis;
      this.type = license.type;
      this.mode = license.mode;
    }

    this.isActive = this.status === 'active';
  }

  toJSON() {
    return {
      license: this.license,
      features: this.features,
      signature: this.signature
    };
  }

  getUnavailableReason() {
    if (this.error) return this.error;

    if (!this.isAvailable) {
      return 'X-Pack plugin is not installed on the Elasticsearch cluster.';
    }
  }

  hasAtLeast(minimumLicenseRequired) {
    const type = this.type;

    if (!type) {
      return false;
    }

    if (!(minimumLicenseRequired in _types.LICENSE_TYPE)) {
      throw new Error(`"${minimumLicenseRequired}" is not a valid license type`);
    }

    return _types.LICENSE_TYPE[minimumLicenseRequired] <= _types.LICENSE_TYPE[type];
  }

  check(pluginName, minimumLicenseRequired) {
    if (!this.isAvailable) {
      return {
        state: 'unavailable',
        message: _i18n.i18n.translate('xpack.licensing.check.errorUnavailableMessage', {
          defaultMessage: 'You cannot use {pluginName} because license information is not available at this time.',
          values: {
            pluginName
          }
        })
      };
    }

    if (!this.isActive) {
      return {
        state: 'expired',
        message: _i18n.i18n.translate('xpack.licensing.check.errorExpiredMessage', {
          defaultMessage: 'You cannot use {pluginName} because your {licenseType} license has expired.',
          values: {
            licenseType: this.type,
            pluginName
          }
        })
      };
    }

    if (!this.hasAtLeast(minimumLicenseRequired)) {
      return {
        state: 'invalid',
        message: _i18n.i18n.translate('xpack.licensing.check.errorUnsupportedMessage', {
          defaultMessage: 'Your {licenseType} license does not support {pluginName}. Please upgrade your license.',
          values: {
            licenseType: this.type,
            pluginName
          }
        })
      };
    }

    return {
      state: 'valid'
    };
  }

  getFeature(name) {
    if (this.isAvailable && this.features && this.features.hasOwnProperty(name)) {
      return { ...this.features[name]
      };
    }

    return {
      isAvailable: false,
      isEnabled: false
    };
  }

}

exports.License = License;