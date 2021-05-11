"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encryptedSavedObjectsMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createEncryptedSavedObjectsSetupMock({
  canEncrypt
} = {
  canEncrypt: false
}) {
  return {
    registerType: jest.fn(),
    __legacyCompat: {
      registerLegacyAPI: jest.fn()
    },
    canEncrypt,
    createMigration: jest.fn()
  };
}

function createEncryptedSavedObjectsStartMock() {
  return {
    isEncryptionError: jest.fn(),
    getClient: jest.fn(opts => createEncryptedSavedObjectsClienttMock(opts))
  };
}

function createEncryptedSavedObjectsClienttMock(opts) {
  return {
    getDecryptedAsInternalUser: jest.fn()
  };
}

const encryptedSavedObjectsMock = {
  createSetup: createEncryptedSavedObjectsSetupMock,
  createStart: createEncryptedSavedObjectsStartMock,
  createClient: createEncryptedSavedObjectsClienttMock
};
exports.encryptedSavedObjectsMock = encryptedSavedObjectsMock;