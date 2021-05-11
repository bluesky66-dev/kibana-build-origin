"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyApiAccess = verifyApiAccess;
exports.LicenseState = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _operators = require("rxjs/operators");

var _check_license = require("../../common/check_license");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

class LicenseState {
  constructor() {
    _defineProperty(this, "licenseInformation", (0, _check_license.checkLicense)(undefined));

    _defineProperty(this, "subscription", null);

    _defineProperty(this, "observable", null);

    _defineProperty(this, "_notifyUsage", null);
  }

  updateInformation(licenseInformation) {
    this.licenseInformation = licenseInformation;
  }

  start(license$) {
    this.observable = license$.pipe((0, _operators.map)(_check_license.checkLicense));
    this.subscription = this.observable.subscribe(this.updateInformation.bind(this));
  }

  setNotifyUsage(notifyUsage) {
    this._notifyUsage = notifyUsage;
  } // 'Graph' is the only allowed feature here at the moment, if this gets extended in the future, add to the union type


  notifyUsage(featureName) {
    if (this._notifyUsage) {
      this._notifyUsage(featureName);
    }
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getLicenseInformation() {
    return this.licenseInformation;
  }

  getLicenseInformation$() {
    return this.observable;
  }

}

exports.LicenseState = LicenseState;

function verifyApiAccess(licenseState) {
  const licenseCheckResults = licenseState.getLicenseInformation();

  if (licenseCheckResults.showAppLink && licenseCheckResults.enableAppLink) {
    return;
  }

  throw _boom.default.forbidden(licenseCheckResults.message);
}