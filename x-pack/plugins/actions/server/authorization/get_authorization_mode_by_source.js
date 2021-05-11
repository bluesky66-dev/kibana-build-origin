"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuthorizationModeBySource = getAuthorizationModeBySource;
exports.AuthorizationMode = void 0;

var _lib = require("../lib");

var _saved_objects = require("../saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LEGACY_VERSION = 'pre-7.10.0';
let AuthorizationMode;
exports.AuthorizationMode = AuthorizationMode;

(function (AuthorizationMode) {
  AuthorizationMode[AuthorizationMode["Legacy"] = 0] = "Legacy";
  AuthorizationMode[AuthorizationMode["RBAC"] = 1] = "RBAC";
})(AuthorizationMode || (exports.AuthorizationMode = AuthorizationMode = {}));

async function getAuthorizationModeBySource(unsecuredSavedObjectsClient, executionSource) {
  var _executionSource$sour, _await$unsecuredSaved;

  return (0, _lib.isSavedObjectExecutionSource)(executionSource) && (executionSource === null || executionSource === void 0 ? void 0 : (_executionSource$sour = executionSource.source) === null || _executionSource$sour === void 0 ? void 0 : _executionSource$sour.type) === _saved_objects.ALERT_SAVED_OBJECT_TYPE && ((_await$unsecuredSaved = (await unsecuredSavedObjectsClient.get(_saved_objects.ALERT_SAVED_OBJECT_TYPE, executionSource.source.id)).attributes.meta) === null || _await$unsecuredSaved === void 0 ? void 0 : _await$unsecuredSaved.versionApiKeyLastmodified) === LEGACY_VERSION ? AuthorizationMode.Legacy : AuthorizationMode.RBAC;
}