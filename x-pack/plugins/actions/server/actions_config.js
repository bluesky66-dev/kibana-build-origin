"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionsConfigurationUtilities = getActionsConfigurationUtilities;
exports.EnabledActionTypes = exports.AllowedHosts = void 0;

var _i18n = require("@kbn/i18n");

var _Option = require("fp-ts/lib/Option");

var _url = _interopRequireDefault(require("url"));

var _lodash = require("lodash");

var _pipeable = require("fp-ts/lib/pipeable");

var _lib = require("./lib");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let AllowedHosts;
exports.AllowedHosts = AllowedHosts;

(function (AllowedHosts) {
  AllowedHosts["Any"] = "*";
})(AllowedHosts || (exports.AllowedHosts = AllowedHosts = {}));

let EnabledActionTypes;
exports.EnabledActionTypes = EnabledActionTypes;

(function (EnabledActionTypes) {
  EnabledActionTypes["Any"] = "*";
})(EnabledActionTypes || (exports.EnabledActionTypes = EnabledActionTypes = {}));

var AllowListingField;

(function (AllowListingField) {
  AllowListingField["URL"] = "url";
  AllowListingField["hostname"] = "hostname";
})(AllowListingField || (AllowListingField = {}));

function allowListErrorMessage(field, value) {
  return _i18n.i18n.translate('xpack.actions.urlAllowedHostsConfigurationError', {
    defaultMessage: 'target {field} "{value}" is not added to the Kibana config xpack.actions.allowedHosts',
    values: {
      value,
      field
    }
  });
}

function disabledActionTypeErrorMessage(actionType) {
  return _i18n.i18n.translate('xpack.actions.disabledActionTypeError', {
    defaultMessage: 'action type "{actionType}" is not enabled in the Kibana config xpack.actions.enabledActionTypes',
    values: {
      actionType
    }
  });
}

function isAllowed({
  allowedHosts
}, hostname) {
  const allowed = new Set(allowedHosts);
  if (allowed.has(AllowedHosts.Any)) return true;
  if (hostname && allowed.has(hostname)) return true;
  return false;
}

function isHostnameAllowedInUri(config, uri) {
  return (0, _pipeable.pipe)((0, _Option.tryCatch)(() => _url.default.parse(uri)), (0, _Option.map)(parsedUrl => parsedUrl.hostname), (0, _Option.mapNullable)(hostname => isAllowed(config, hostname)), (0, _Option.getOrElse)(() => false));
}

function isActionTypeEnabledInConfig({
  enabledActionTypes
}, actionType) {
  const enabled = new Set(enabledActionTypes);
  if (enabled.has(EnabledActionTypes.Any)) return true;
  if (enabled.has(actionType)) return true;
  return false;
}

function getProxySettingsFromConfig(config) {
  if (!config.proxyUrl) {
    return undefined;
  }

  return {
    proxyUrl: config.proxyUrl,
    proxyHeaders: config.proxyHeaders,
    proxyRejectUnauthorizedCertificates: config.proxyRejectUnauthorizedCertificates
  };
}

function getResponseSettingsFromConfig(config) {
  return {
    maxContentLength: config.maxResponseContentLength.getValueInBytes(),
    timeout: config.responseTimeout.asMilliseconds()
  };
}

function getActionsConfigurationUtilities(config) {
  const isHostnameAllowed = (0, _lodash.curry)(isAllowed)(config);
  const isUriAllowed = (0, _lodash.curry)(isHostnameAllowedInUri)(config);
  const isActionTypeEnabled = (0, _lodash.curry)(isActionTypeEnabledInConfig)(config);
  return {
    isHostnameAllowed,
    isUriAllowed,
    isActionTypeEnabled,
    getProxySettings: () => getProxySettingsFromConfig(config),
    getResponseSettings: () => getResponseSettingsFromConfig(config),
    isRejectUnauthorizedCertificatesEnabled: () => config.rejectUnauthorized,

    ensureUriAllowed(uri) {
      if (!isUriAllowed(uri)) {
        throw new Error(allowListErrorMessage(AllowListingField.URL, uri));
      }
    },

    ensureHostnameAllowed(hostname) {
      if (!isHostnameAllowed(hostname)) {
        throw new Error(allowListErrorMessage(AllowListingField.hostname, hostname));
      }
    },

    ensureActionTypeEnabled(actionType) {
      if (!isActionTypeEnabled(actionType)) {
        throw new _lib.ActionTypeDisabledError(disabledActionTypeErrorMessage(actionType), 'config');
      }
    }

  };
}