"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSpacesClient = void 0;

var _legacy_audit_logger = require("./legacy_audit_logger");

var _secure_spaces_client_wrapper = require("./secure_spaces_client_wrapper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const setupSpacesClient = ({
  audit,
  authz,
  spaces
}) => {
  if (!spaces) {
    return;
  }

  const {
    spacesClient
  } = spaces;
  spacesClient.setClientRepositoryFactory((request, savedObjectsStart) => {
    if (authz.mode.useRbacForRequest(request)) {
      return savedObjectsStart.createInternalRepository(['space']);
    }

    return savedObjectsStart.createScopedRepository(request, ['space']);
  });
  const spacesAuditLogger = new _legacy_audit_logger.LegacySpacesAuditLogger(audit.getLogger());
  spacesClient.registerClientWrapper((request, baseClient) => new _secure_spaces_client_wrapper.SecureSpacesClientWrapper(baseClient, request, authz, audit.asScoped(request), spacesAuditLogger));
};

exports.setupSpacesClient = setupSpacesClient;