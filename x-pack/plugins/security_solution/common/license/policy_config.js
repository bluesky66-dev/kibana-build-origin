"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsetPolicyFeaturesAboveLicenseLevel = exports.isEndpointPolicyValidForLicense = void 0;

var _license = require("./license");

var _policy_config = require("../endpoint/models/policy_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given an endpoint package policy, verifies that all enabled features that
 * require a certain license level have a valid license for them.
 */


const isEndpointPolicyValidForLicense = (policy, license) => {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    return true; // currently, platinum allows all features
  }

  const defaults = (0, _policy_config.policyFactoryWithoutPaidFeatures)(); // only platinum or higher may disable malware notification

  if (policy.windows.popup.malware.enabled !== defaults.windows.popup.malware.enabled || policy.mac.popup.malware.enabled !== defaults.mac.popup.malware.enabled) {
    return false;
  } // Only Platinum or higher may change the malware message (which can be blank or what Endpoint defaults)


  if ([policy.windows, policy.mac].some(p => p.popup.malware.message !== '' && p.popup.malware.message !== _policy_config.DefaultMalwareMessage)) {
    return false;
  } // only platinum or higher may enable ransomware


  if (policy.windows.ransomware.mode !== defaults.windows.ransomware.mode) {
    return false;
  } // only platinum or higher may enable ransomware notification


  if (policy.windows.popup.ransomware.enabled !== defaults.windows.popup.ransomware.enabled) {
    return false;
  } // Only Platinum or higher may change the ransomware message (which can be blank or what Endpoint defaults)


  if (policy.windows.popup.ransomware.message !== '' && policy.windows.popup.ransomware.message !== _policy_config.DefaultMalwareMessage) {
    return false;
  }

  return true;
};
/**
 * Resets paid features in a PolicyConfig back to default values
 * when unsupported by the given license level.
 */


exports.isEndpointPolicyValidForLicense = isEndpointPolicyValidForLicense;

const unsetPolicyFeaturesAboveLicenseLevel = (policy, license) => {
  if ((0, _license.isAtLeast)(license, 'platinum')) {
    return policy;
  } // set any license-gated features back to the defaults


  return (0, _policy_config.policyFactoryWithoutPaidFeatures)(policy);
};

exports.unsetPolicyFeaturesAboveLicenseLevel = unsetPolicyFeaturesAboveLicenseLevel;