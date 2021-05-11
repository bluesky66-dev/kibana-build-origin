"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsAuthorizationAuditLogger = exports.AuthorizationResult = exports.ScopeType = void 0;

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


let ScopeType;
exports.ScopeType = ScopeType;

(function (ScopeType) {
  ScopeType[ScopeType["Consumer"] = 0] = "Consumer";
  ScopeType[ScopeType["Producer"] = 1] = "Producer";
})(ScopeType || (exports.ScopeType = ScopeType = {}));

let AuthorizationResult;
exports.AuthorizationResult = AuthorizationResult;

(function (AuthorizationResult) {
  AuthorizationResult["Unauthorized"] = "Unauthorized";
  AuthorizationResult["Authorized"] = "Authorized";
})(AuthorizationResult || (exports.AuthorizationResult = AuthorizationResult = {}));

class AlertsAuthorizationAuditLogger {
  constructor(auditLogger = {
    log() {}

  }) {
    _defineProperty(this, "auditLogger", void 0);

    this.auditLogger = auditLogger;
  }

  getAuthorizationMessage(authorizationResult, alertTypeId, scopeType, scope, operation) {
    return `${authorizationResult} to ${operation} a "${alertTypeId}" alert ${scopeType === ScopeType.Consumer ? `for "${scope}"` : `by "${scope}"`}`;
  }

  alertsAuthorizationFailure(username, alertTypeId, scopeType, scope, operation) {
    const message = this.getAuthorizationMessage(AuthorizationResult.Unauthorized, alertTypeId, scopeType, scope, operation);
    this.auditLogger.log('alerts_authorization_failure', `${username} ${message}`, {
      username,
      alertTypeId,
      scopeType,
      scope,
      operation
    });
    return message;
  }

  alertsUnscopedAuthorizationFailure(username, operation) {
    const message = `Unauthorized to ${operation} any alert types`;
    this.auditLogger.log('alerts_unscoped_authorization_failure', `${username} ${message}`, {
      username,
      operation
    });
    return message;
  }

  alertsAuthorizationSuccess(username, alertTypeId, scopeType, scope, operation) {
    const message = this.getAuthorizationMessage(AuthorizationResult.Authorized, alertTypeId, scopeType, scope, operation);
    this.auditLogger.log('alerts_authorization_success', `${username} ${message}`, {
      username,
      alertTypeId,
      scopeType,
      scope,
      operation
    });
    return message;
  }

  alertsBulkAuthorizationSuccess(username, authorizedEntries, scopeType, operation) {
    const message = `${AuthorizationResult.Authorized} to ${operation}: ${authorizedEntries.map(([alertTypeId, scope]) => `"${alertTypeId}" alert ${scopeType === ScopeType.Consumer ? `for "${scope}"` : `by "${scope}"`}`).join(', ')}`;
    this.auditLogger.log('alerts_authorization_success', `${username} ${message}`, {
      username,
      scopeType,
      authorizedEntries,
      operation
    });
    return message;
  }

}

exports.AlertsAuthorizationAuditLogger = AlertsAuthorizationAuditLogger;