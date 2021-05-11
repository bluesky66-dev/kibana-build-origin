"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptionError = exports.EncryptionErrorOperation = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines operation (encryption or decryption) during which error occurred.
 */

let EncryptionErrorOperation;
exports.EncryptionErrorOperation = EncryptionErrorOperation;

(function (EncryptionErrorOperation) {
  EncryptionErrorOperation[EncryptionErrorOperation["Encryption"] = 0] = "Encryption";
  EncryptionErrorOperation[EncryptionErrorOperation["Decryption"] = 1] = "Decryption";
})(EncryptionErrorOperation || (exports.EncryptionErrorOperation = EncryptionErrorOperation = {}));

class EncryptionError extends Error {
  constructor(message, attributeName, operation, cause) {
    super(message); // Set the prototype explicitly, see:
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

    this.attributeName = attributeName;
    this.operation = operation;
    this.cause = cause;
    Object.setPrototypeOf(this, EncryptionError.prototype);
  }

  toJSON() {
    return {
      message: this.message
    };
  }

}

exports.EncryptionError = EncryptionError;