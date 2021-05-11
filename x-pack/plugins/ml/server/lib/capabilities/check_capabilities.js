"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capabilitiesProvider = capabilitiesProvider;
exports.hasMlCapabilitiesProvider = hasMlCapabilitiesProvider;

var _log = require("../../lib/log");

var _capabilities = require("../../../common/types/capabilities");

var _upgrade = require("./upgrade");

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function capabilitiesProvider(mlClient, capabilities, mlLicense, isMlEnabledInSpace) {
  const {
    isUpgradeInProgress
  } = (0, _upgrade.upgradeCheckProvider)(mlClient);

  async function getCapabilities() {
    const upgradeInProgress = await isUpgradeInProgress();
    const isPlatinumOrTrialLicense = mlLicense.isFullLicense();
    const mlFeatureEnabledInSpace = await isMlEnabledInSpace();

    if (upgradeInProgress === true) {
      // if an upgrade is in progress, set all admin capabilities to false
      disableAdminPrivileges(capabilities);
    }

    return {
      capabilities,
      upgradeInProgress,
      isPlatinumOrTrialLicense,
      mlFeatureEnabledInSpace
    };
  }

  return {
    getCapabilities
  };
}

function disableAdminPrivileges(capabilities) {
  Object.keys(_capabilities.adminMlCapabilities).forEach(k => {
    capabilities[k] = false;
  });
  capabilities.canCreateAnnotation = false;
  capabilities.canDeleteAnnotation = false;
}

function hasMlCapabilitiesProvider(resolveMlCapabilities) {
  return request => {
    let mlCapabilities = null;
    return async capabilities => {
      try {
        mlCapabilities = await resolveMlCapabilities(request);
      } catch (e) {
        _log.mlLog.error(e);

        throw new _errors.UnknownMLCapabilitiesError(`Unable to perform ML capabilities check ${e}`);
      }

      if (mlCapabilities === null) {
        throw new _errors.MLPrivilegesUninitialized('ML capabilities have not been initialized');
      }

      if (capabilities.every(c => mlCapabilities[c] === true) === false) {
        throw new _errors.InsufficientMLCapabilities('Insufficient privileges to access feature');
      }
    };
  };
}