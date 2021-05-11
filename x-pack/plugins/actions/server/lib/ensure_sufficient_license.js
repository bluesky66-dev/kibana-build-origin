"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureSufficientLicense = ensureSufficientLicense;

var _types = require("../../../licensing/common/types");

var _builtin_action_types = require("../builtin_action_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CASE_ACTION_TYPE_ID = '.case';
const ACTIONS_SCOPED_WITHIN_STACK = new Set([_builtin_action_types.ServerLogActionTypeId, _builtin_action_types.IndexActionTypeId, CASE_ACTION_TYPE_ID]);

function ensureSufficientLicense(actionType) {
  if (!(actionType.minimumLicenseRequired in _types.LICENSE_TYPE)) {
    throw new Error(`"${actionType.minimumLicenseRequired}" is not a valid license type`);
  }

  if (_types.LICENSE_TYPE[actionType.minimumLicenseRequired] < _types.LICENSE_TYPE.gold && !ACTIONS_SCOPED_WITHIN_STACK.has(actionType.id)) {
    throw new Error(`Third party action type "${actionType.id}" can only set minimumLicenseRequired to a gold license or higher`);
  }
}