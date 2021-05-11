"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionsAuthorizationAuditLogger = exports.AuthorizationResult = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let AuthorizationResult;
exports.AuthorizationResult = AuthorizationResult;

(function (AuthorizationResult) {
  AuthorizationResult["Unauthorized"] = "Unauthorized";
  AuthorizationResult["Authorized"] = "Authorized";
})(AuthorizationResult || (exports.AuthorizationResult = AuthorizationResult = {}));

class ActionsAuthorizationAuditLogger {
  constructor(auditLogger = {
    log() {}

  }) {
    _defineProperty(this, "auditLogger", void 0);

    this.auditLogger = auditLogger;
  }

  getAuthorizationMessage(authorizationResult, operation, actionTypeId) {
    return `${authorizationResult} to ${operation} ${actionTypeId ? `a "${actionTypeId}" action` : `actions`}`;
  }

  actionsAuthorizationFailure(username, operation, actionTypeId) {
    const message = this.getAuthorizationMessage(AuthorizationResult.Unauthorized, operation, actionTypeId);
    this.auditLogger.log('actions_authorization_failure', `${username} ${message}`, {
      username,
      actionTypeId,
      operation
    });
    return message;
  }

  actionsAuthorizationSuccess(username, operation, actionTypeId) {
    const message = this.getAuthorizationMessage(AuthorizationResult.Authorized, operation, actionTypeId);
    this.auditLogger.log('actions_authorization_success', `${username} ${message}`, {
      username,
      actionTypeId,
      operation
    });
    return message;
  }

}

exports.ActionsAuthorizationAuditLogger = ActionsAuthorizationAuditLogger;