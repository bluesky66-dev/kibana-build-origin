"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV7120 = void 0;

var _lodash = require("lodash");

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migratePackagePolicyToV7120 = packagePolicyDoc => {
  var _packagePolicyDoc$att;

  const updatedPackagePolicyDoc = (0, _lodash.cloneDeep)(packagePolicyDoc);

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    const input = updatedPackagePolicyDoc.attributes.inputs[0];
    const ransomware = {
      mode: _types.ProtectionModes.off
    };
    const ransomwarePopup = {
      message: '',
      enabled: false
    };

    if (input && input.config) {
      const policy = input.config.policy.value;
      policy.windows.ransomware = ransomware;
      policy.windows.popup.ransomware = ransomwarePopup;
    }
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7120 = migratePackagePolicyToV7120;