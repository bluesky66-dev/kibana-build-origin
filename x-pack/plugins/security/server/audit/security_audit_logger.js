"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecurityAuditLogger = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated
 */

class SecurityAuditLogger {
  constructor(logger) {
    this.logger = logger;
  }
  /**
   * @deprecated
   */


  savedObjectsAuthorizationFailure(username, action, types, spaceIds, missing, args) {
    const typesString = types.join(',');
    const spacesString = spaceIds.length ? ` in [${spaceIds.join(',')}]` : '';
    const missingString = missing.map(({
      spaceId,
      privilege
    }) => `${spaceId ? `(${spaceId})` : ''}${privilege}`).join(',');
    this.logger.log('saved_objects_authorization_failure', `${username} unauthorized to [${action}] [${typesString}]${spacesString}: missing [${missingString}]`, {
      username,
      action,
      types,
      spaceIds,
      missing,
      args
    });
  }
  /**
   * @deprecated
   */


  savedObjectsAuthorizationSuccess(username, action, types, spaceIds, args) {
    const typesString = types.join(',');
    const spacesString = spaceIds.length ? ` in [${spaceIds.join(',')}]` : '';
    this.logger.log('saved_objects_authorization_success', `${username} authorized to [${action}] [${typesString}]${spacesString}`, {
      username,
      action,
      types,
      spaceIds,
      args
    });
  }
  /**
   * @deprecated
   */


  accessAgreementAcknowledged(username, provider) {
    this.logger.log('access_agreement_acknowledged', `${username} acknowledged access agreement (${provider.type}/${provider.name}).`, {
      username,
      provider
    });
  }

}

exports.SecurityAuditLogger = SecurityAuditLogger;