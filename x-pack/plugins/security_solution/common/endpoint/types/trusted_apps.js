"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConditionEntryField = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** API request params for deleting Trusted App entry */

/** API request params for retrieving a list of Trusted Apps */

/** API Request body for creating a new Trusted App entry */

let ConditionEntryField;
exports.ConditionEntryField = ConditionEntryField;

(function (ConditionEntryField) {
  ConditionEntryField["HASH"] = "process.hash.*";
  ConditionEntryField["PATH"] = "process.executable.caseless";
  ConditionEntryField["SIGNER"] = "process.Ext.code_signature";
})(ConditionEntryField || (exports.ConditionEntryField = ConditionEntryField = {}));