"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyApiAccessFactory = verifyApiAccessFactory;
exports.LicenseState = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _std = require("@kbn/std");

var _lodash = require("lodash");

var _plugin = require("../constants/plugin");

var _get_alert_type_feature_usage_name = require("./get_alert_type_feature_usage_name");

var _alert_type_disabled = require("./errors/alert_type_disabled");

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
  constructor(license$) {
    _defineProperty(this, "licenseInformation", this.checkLicense(undefined));

    _defineProperty(this, "subscription", void 0);

    _defineProperty(this, "license", void 0);

    _defineProperty(this, "_notifyUsage", null);

    this.subscription = license$.subscribe(this.updateInformation.bind(this));
  }

  updateInformation(license) {
    this.license = license;
    this.licenseInformation = this.checkLicense(license);
  }

  clean() {
    this.subscription.unsubscribe();
  }

  getLicenseInformation() {
    return this.licenseInformation;
  }

  setNotifyUsage(notifyUsage) {
    this._notifyUsage = notifyUsage;
  }

  getLicenseCheckForAlertType(alertTypeId, alertTypeName, minimumLicenseRequired, {
    notifyUsage
  } = {
    notifyUsage: false
  }) {
    var _this$license;

    if (notifyUsage) {
      this.notifyUsage(alertTypeName, minimumLicenseRequired);
    }

    if (!((_this$license = this.license) !== null && _this$license !== void 0 && _this$license.isAvailable)) {
      return {
        isValid: false,
        reason: 'unavailable'
      };
    }

    const check = this.license.check(alertTypeId, minimumLicenseRequired);

    switch (check.state) {
      case 'expired':
        return {
          isValid: false,
          reason: 'expired'
        };

      case 'invalid':
        return {
          isValid: false,
          reason: 'invalid'
        };

      case 'unavailable':
        return {
          isValid: false,
          reason: 'unavailable'
        };

      case 'valid':
        return {
          isValid: true
        };

      default:
        return (0, _std.assertNever)(check.state);
    }
  }

  notifyUsage(alertTypeName, minimumLicenseRequired) {
    // No need to notify usage on basic alert types
    if (this._notifyUsage && minimumLicenseRequired !== 'basic') {
      this._notifyUsage((0, _get_alert_type_feature_usage_name.getAlertTypeFeatureUsageName)(alertTypeName));
    }
  }

  checkLicense(license) {
    if (!license || !license.isAvailable) {
      return {
        showAppLink: true,
        enableAppLink: false,
        message: _i18n.i18n.translate('xpack.alerts.serverSideErrors.unavailableLicenseInformationErrorMessage', {
          defaultMessage: 'Alerts is unavailable - license information is not available at this time.'
        })
      };
    }

    const check = license.check(_plugin.PLUGIN.ID, _plugin.PLUGIN.MINIMUM_LICENSE_REQUIRED);

    switch (check.state) {
      case 'expired':
        return {
          showAppLink: true,
          enableAppLink: false,
          message: check.message || ''
        };

      case 'invalid':
      case 'unavailable':
        return {
          showAppLink: false,
          enableAppLink: false,
          message: check.message || ''
        };

      case 'valid':
        return {
          showAppLink: true,
          enableAppLink: true,
          message: ''
        };

      default:
        return (0, _std.assertNever)(check.state);
    }
  }

  ensureLicenseForAlertType(alertType) {
    this.notifyUsage(alertType.name, alertType.minimumLicenseRequired);
    const check = this.getLicenseCheckForAlertType(alertType.id, alertType.name, alertType.minimumLicenseRequired);

    if (check.isValid) {
      return;
    }

    switch (check.reason) {
      case 'unavailable':
        throw new _alert_type_disabled.AlertTypeDisabledError(_i18n.i18n.translate('xpack.alerts.serverSideErrors.unavailableLicenseErrorMessage', {
          defaultMessage: 'Alert type {alertTypeId} is disabled because license information is not available at this time.',
          values: {
            alertTypeId: alertType.id
          }
        }), 'license_unavailable');

      case 'expired':
        throw new _alert_type_disabled.AlertTypeDisabledError(_i18n.i18n.translate('xpack.alerts.serverSideErrors.expirerdLicenseErrorMessage', {
          defaultMessage: 'Alert type {alertTypeId} is disabled because your {licenseType} license has expired.',
          values: {
            alertTypeId: alertType.id,
            licenseType: this.license.type
          }
        }), 'license_expired');

      case 'invalid':
        throw new _alert_type_disabled.AlertTypeDisabledError(_i18n.i18n.translate('xpack.alerts.serverSideErrors.invalidLicenseErrorMessage', {
          defaultMessage: 'Alert {alertTypeId} is disabled because it requires a {licenseType} license. Go to License Management to view upgrade options.',
          values: {
            alertTypeId: alertType.id,
            licenseType: (0, _lodash.capitalize)(alertType.minimumLicenseRequired)
          }
        }), 'license_invalid');

      default:
        (0, _std.assertNever)(check.reason);
    }
  }

}

exports.LicenseState = LicenseState;

function verifyApiAccessFactory(licenseState) {
  function verifyApiAccess() {
    const licenseCheckResults = licenseState.getLicenseInformation();

    if (licenseCheckResults.showAppLink && licenseCheckResults.enableAppLink) {
      return null;
    }

    throw _boom.default.forbidden(licenseCheckResults.message);
  }

  return verifyApiAccess;
}