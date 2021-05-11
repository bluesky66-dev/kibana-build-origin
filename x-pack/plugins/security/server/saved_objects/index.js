"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;

var _server = require("../../../../../src/core/server");

var _secure_saved_objects_client_wrapper = require("./secure_saved_objects_client_wrapper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function setupSavedObjects({
  legacyAuditLogger,
  audit,
  authz,
  savedObjects,
  getSpacesService
}) {
  const getKibanaRequest = request => request instanceof _server.KibanaRequest ? request : _server.KibanaRequest.from(request);

  savedObjects.setClientFactoryProvider(repositoryFactory => ({
    request,
    includedHiddenTypes
  }) => {
    const kibanaRequest = getKibanaRequest(request);
    return new _server.SavedObjectsClient(authz.mode.useRbacForRequest(kibanaRequest) ? repositoryFactory.createInternalRepository(includedHiddenTypes) : repositoryFactory.createScopedRepository(kibanaRequest, includedHiddenTypes));
  });
  savedObjects.addClientWrapper(Number.MAX_SAFE_INTEGER - 1, 'security', ({
    client,
    request
  }) => {
    const kibanaRequest = getKibanaRequest(request);
    return authz.mode.useRbacForRequest(kibanaRequest) ? new _secure_saved_objects_client_wrapper.SecureSavedObjectsClientWrapper({
      actions: authz.actions,
      legacyAuditLogger,
      auditLogger: audit.asScoped(kibanaRequest),
      baseClient: client,
      checkSavedObjectsPrivilegesAsCurrentUser: authz.checkSavedObjectsPrivilegesWithRequest(kibanaRequest),
      errors: _server.SavedObjectsClient.errors,
      getSpacesService
    }) : client;
  });
}