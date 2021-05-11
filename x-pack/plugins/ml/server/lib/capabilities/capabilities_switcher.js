"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCapabilitiesSwitcher = void 0;

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _license = require("../../../common/license");

var _capabilities = require("../../../common/types/capabilities");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const setupCapabilitiesSwitcher = (coreSetup, license$, logger) => {
  coreSetup.capabilities.registerSwitcher(getSwitcher(license$, logger));
};

exports.setupCapabilitiesSwitcher = setupCapabilitiesSwitcher;

function getSwitcher(license$, logger) {
  return async (request, capabilities) => {
    const isAnonymousRequest = !request.route.options.authRequired;

    if (isAnonymousRequest) {
      return capabilities;
    }

    try {
      const license = await license$.pipe((0, _operators.take)(1)).toPromise();
      const mlEnabled = (0, _license.isMlEnabled)(license); // full license, leave capabilities as they were

      if (mlEnabled && (0, _license.isFullLicense)(license)) {
        return capabilities;
      }

      const mlCaps = capabilities.ml;
      const originalCapabilities = (0, _lodash.cloneDeep)(mlCaps); // not full licence, switch off all capabilities

      Object.keys(mlCaps).forEach(k => {
        mlCaps[k] = false;
      }); // for a basic license, reapply the original capabilities for the basic license features

      if (mlEnabled && (0, _license.isMinimumLicense)(license)) {
        _capabilities.basicLicenseMlCapabilities.forEach(c => mlCaps[c] = originalCapabilities[c]);
      }

      return capabilities;
    } catch (e) {
      logger.debug(`Error updating capabilities for ML based on licensing: ${e}`);
      return capabilities;
    }
  };
}