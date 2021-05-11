"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFullLicense = isFullLicense;
exports.isMinimumLicense = isMinimumLicense;
exports.isMlEnabled = isMlEnabled;
exports.MlLicense = exports.MINIMUM_FULL_LICENSE = exports.MINIMUM_LICENSE = void 0;

var _app = require("../constants/app");

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

const MINIMUM_LICENSE = 'basic';
exports.MINIMUM_LICENSE = MINIMUM_LICENSE;
const MINIMUM_FULL_LICENSE = 'platinum';
exports.MINIMUM_FULL_LICENSE = MINIMUM_FULL_LICENSE;

class MlLicense {
  constructor() {
    _defineProperty(this, "_licenseSubscription", null);

    _defineProperty(this, "_license", null);

    _defineProperty(this, "_isSecurityEnabled", false);

    _defineProperty(this, "_hasLicenseExpired", false);

    _defineProperty(this, "_isMlEnabled", false);

    _defineProperty(this, "_isMinimumLicense", false);

    _defineProperty(this, "_isFullLicense", false);

    _defineProperty(this, "_initialized", false);
  }

  setup(license$, postInitFunctions) {
    this._licenseSubscription = license$.subscribe(async license => {
      const {
        isEnabled: securityIsEnabled
      } = license.getFeature('security');
      this._license = license;
      this._isSecurityEnabled = securityIsEnabled;
      this._hasLicenseExpired = this._license.status === 'expired';
      this._isMlEnabled = this._license.getFeature(_app.PLUGIN_ID).isEnabled;
      this._isMinimumLicense = isMinimumLicense(this._license);
      this._isFullLicense = isFullLicense(this._license);

      if (this._initialized === false && postInitFunctions !== undefined) {
        postInitFunctions.forEach(f => f(this));
      }

      this._initialized = true;
    });
  }

  unsubscribe() {
    if (this._licenseSubscription !== null) {
      this._licenseSubscription.unsubscribe();
    }
  }

  isSecurityEnabled() {
    return this._isSecurityEnabled;
  }

  hasLicenseExpired() {
    return this._hasLicenseExpired;
  }

  isMlEnabled() {
    return this._isMlEnabled;
  }

  isMinimumLicense() {
    return this._isMinimumLicense;
  }

  isFullLicense() {
    return this._isFullLicense;
  }

}

exports.MlLicense = MlLicense;

function isFullLicense(license) {
  return license.check(_app.PLUGIN_ID, MINIMUM_FULL_LICENSE).state === 'valid';
}

function isMinimumLicense(license) {
  return license.check(_app.PLUGIN_ID, MINIMUM_LICENSE).state === 'valid';
}

function isMlEnabled(license) {
  return license.getFeature(_app.PLUGIN_ID).isEnabled;
}