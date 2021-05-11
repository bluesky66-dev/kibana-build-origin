"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptedSavedObjectsAuditLogger = void 0;

var _crypto = require("../crypto");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents all audit events the plugin can log.
 */


class EncryptedSavedObjectsAuditLogger {
  constructor(logger = {
    log() {}

  }) {
    this.logger = logger;
  }

  encryptAttributeFailure(attributeName, descriptor, user) {
    this.logger.log('encrypt_failure', `Failed to encrypt attribute "${attributeName}" for saved object "[${(0, _crypto.descriptorToArray)(descriptor)}]".`, { ...descriptor,
      attributeName,
      username: user === null || user === void 0 ? void 0 : user.username
    });
  }

  decryptAttributeFailure(attributeName, descriptor, user) {
    this.logger.log('decrypt_failure', `Failed to decrypt attribute "${attributeName}" for saved object "[${(0, _crypto.descriptorToArray)(descriptor)}]".`, { ...descriptor,
      attributeName,
      username: user === null || user === void 0 ? void 0 : user.username
    });
  }

  encryptAttributesSuccess(attributesNames, descriptor, user) {
    this.logger.log('encrypt_success', `Successfully encrypted attributes "[${attributesNames}]" for saved object "[${(0, _crypto.descriptorToArray)(descriptor)}]".`, { ...descriptor,
      attributesNames,
      username: user === null || user === void 0 ? void 0 : user.username
    });
  }

  decryptAttributesSuccess(attributesNames, descriptor, user) {
    this.logger.log('decrypt_success', `Successfully decrypted attributes "[${attributesNames}]" for saved object "[${(0, _crypto.descriptorToArray)(descriptor)}]".`, { ...descriptor,
      attributesNames,
      username: user === null || user === void 0 ? void 0 : user.username
    });
  }

}

exports.EncryptedSavedObjectsAuditLogger = EncryptedSavedObjectsAuditLogger;