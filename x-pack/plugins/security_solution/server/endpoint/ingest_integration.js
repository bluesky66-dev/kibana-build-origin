"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackagePolicyUpdateCallback = exports.getPackagePolicyCreateCallback = void 0;

var _policy_config = require("../../common/endpoint/models/policy_config");

var _artifacts = require("./lib/artifacts");

var _common = require("./lib/artifacts/common");

var _manifest2 = require("../../common/endpoint/schema/manifest");

var _create_index_route = require("../lib/detection_engine/routes/index/create_index_route");

var _add_prepackaged_rules_route = require("../lib/detection_engine/routes/rules/add_prepackaged_rules_route");

var _common2 = require("../lib/timeline/routes/utils/common");

var _policy_config2 = require("../../common/license/policy_config");

var _license = require("../../common/license/license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getManifest = async (logger, manifestManager) => {
  var _manifest;

  let manifest = null;

  try {
    manifest = await manifestManager.getLastComputedManifest(); // If we have not yet computed a manifest, then we have to do so now. This should only happen
    // once.

    if (manifest == null) {
      // New computed manifest based on current state of exception list
      const newManifest = await manifestManager.buildNewManifest(); // Persist new artifacts

      const persistErrors = await manifestManager.pushArtifacts(newManifest.getAllArtifacts());

      if (persistErrors.length) {
        (0, _common.reportErrors)(logger, persistErrors);
        throw new Error('Unable to persist new artifacts.');
      } // Commit the manifest state


      await manifestManager.commit(newManifest);
      manifest = newManifest;
    }
  } catch (err) {
    logger.error(err);
  }

  return (_manifest = manifest) !== null && _manifest !== void 0 ? _manifest : _artifacts.Manifest.getDefault();
};
/**
 * Callback to handle creation of PackagePolicies in Fleet
 */


const getPackagePolicyCreateCallback = (logger, manifestManager, appClientFactory, maxTimelineImportExportSize, securitySetup, alerts, licenseService, exceptionsClient) => {
  return async (newPackagePolicy, context, request) => {
    var _newPackagePolicy$pac; // We only care about Endpoint package policies


    if (((_newPackagePolicy$pac = newPackagePolicy.package) === null || _newPackagePolicy$pac === void 0 ? void 0 : _newPackagePolicy$pac.name) !== 'endpoint') {
      return newPackagePolicy;
    } // prep for detection rules creation


    const appClient = appClientFactory.create(request); // This callback is called by fleet plugin.
    // It doesn't have access to SecuritySolutionRequestHandlerContext in runtime.
    // Muting the error to have green CI.
    // @ts-expect-error

    const frameworkRequest = await (0, _common2.buildFrameworkRequest)(context, securitySetup, request); // Create detection index & rules (if necessary). move past any failure, this is just a convenience

    try {
      // @ts-expect-error
      await (0, _create_index_route.createDetectionIndex)(context, appClient);
    } catch (err) {
      if (err.statusCode !== 409) {
        // 409 -> detection index already exists, which is fine
        logger.warn(`Possible problem creating detection signals index (${err.statusCode}): ${err.message}`);
      }
    }

    try {
      // this checks to make sure index exists first, safe to try in case of failure above
      // may be able to recover from minor errors
      await (0, _add_prepackaged_rules_route.createPrepackagedRules)( // @ts-expect-error
      context, appClient, alerts.getAlertsClientWithRequest(request), frameworkRequest, maxTimelineImportExportSize, exceptionsClient);
    } catch (err) {
      logger.error(`Unable to create detection rules automatically (${err.statusCode}): ${err.message}`);
    } // Get most recent manifest


    const manifest = await getManifest(logger, manifestManager);
    const serializedManifest = manifest.toPackagePolicyManifest();

    if (!_manifest2.manifestDispatchSchema.is(serializedManifest)) {
      // This should not happen.
      // But if it does, we log it and return it anyway.
      logger.error('Invalid manifest');
    } // We cast the type here so that any changes to the Endpoint specific data
    // follow the types/schema expected


    let updatedPackagePolicy = newPackagePolicy; // Until we get the Default Policy Configuration in the Endpoint package,
    // we will add it here manually at creation time.
    // generate the correct default policy depending on the license

    const defaultPolicy = (0, _license.isAtLeast)(licenseService.getLicenseInformation(), 'platinum') ? (0, _policy_config.policyFactory)() : (0, _policy_config.policyFactoryWithoutPaidFeatures)();
    updatedPackagePolicy = { ...newPackagePolicy,
      inputs: [{
        type: 'endpoint',
        enabled: true,
        streams: [],
        config: {
          artifact_manifest: {
            value: serializedManifest
          },
          policy: {
            value: defaultPolicy
          }
        }
      }]
    };
    return updatedPackagePolicy;
  };
};

exports.getPackagePolicyCreateCallback = getPackagePolicyCreateCallback;

const getPackagePolicyUpdateCallback = (logger, licenseService) => {
  return async (newPackagePolicy, context, request) => {
    var _newPackagePolicy$pac2, _newPackagePolicy$inp, _newPackagePolicy$inp2;

    if (((_newPackagePolicy$pac2 = newPackagePolicy.package) === null || _newPackagePolicy$pac2 === void 0 ? void 0 : _newPackagePolicy$pac2.name) !== 'endpoint') {
      return newPackagePolicy;
    }

    if (!(0, _policy_config2.isEndpointPolicyValidForLicense)((_newPackagePolicy$inp = newPackagePolicy.inputs[0].config) === null || _newPackagePolicy$inp === void 0 ? void 0 : (_newPackagePolicy$inp2 = _newPackagePolicy$inp.policy) === null || _newPackagePolicy$inp2 === void 0 ? void 0 : _newPackagePolicy$inp2.value, licenseService.getLicenseInformation())) {
      logger.warn('Incorrect license tier for paid policy fields');
      const licenseError = new Error('Requires Platinum license');
      licenseError.statusCode = 403;
      throw licenseError;
    }

    return newPackagePolicy;
  };
};

exports.getPackagePolicyUpdateCallback = getPackagePolicyUpdateCallback;