"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV7110 = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migratePackagePolicyToV7110 = packagePolicyDoc => {
  var _packagePolicyDoc$att;

  const updatedPackagePolicyDoc = (0, _lodash.cloneDeep)(packagePolicyDoc);

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    const input = updatedPackagePolicyDoc.attributes.inputs[0];
    const popup = {
      malware: {
        message: '',
        enabled: false
      }
    };

    if (input && input.config) {
      const policy = input.config.policy.value;
      policy.windows.antivirus_registration = policy.windows.antivirus_registration || {
        enabled: false
      };
      policy.windows.popup = popup;
      policy.mac.popup = popup;
    }
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7110 = migratePackagePolicyToV7110;