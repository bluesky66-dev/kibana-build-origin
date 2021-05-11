"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingSecurity = void 0;

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


class AlertingSecurity {}

exports.AlertingSecurity = AlertingSecurity;

_defineProperty(AlertingSecurity, "getSecurityHealth", async (context, encryptedSavedObjects) => {
  const {
    security: {
      enabled: isSecurityEnabled = false,
      ssl: {
        http: {
          enabled: isTLSEnabled = false
        } = {}
      } = {}
    } = {}
  } = await context.core.elasticsearch.legacy.client.callAsInternalUser('transport.request', {
    method: 'GET',
    path: '/_xpack/usage'
  });
  return {
    isSufficientlySecure: !isSecurityEnabled || isSecurityEnabled && isTLSEnabled,
    hasPermanentEncryptionKey: (encryptedSavedObjects === null || encryptedSavedObjects === void 0 ? void 0 : encryptedSavedObjects.canEncrypt) === true
  };
});