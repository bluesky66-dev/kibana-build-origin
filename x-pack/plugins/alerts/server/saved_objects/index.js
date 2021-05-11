"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;
Object.defineProperty(exports, "partiallyUpdateAlert", {
  enumerable: true,
  get: function () {
    return _partially_update_alert.partiallyUpdateAlert;
  }
});
exports.AlertAttributesExcludedFromAAD = void 0;

var _mappings = _interopRequireDefault(require("./mappings.json"));

var _migrations = require("./migrations");

var _partially_update_alert = require("./partially_update_alert");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AlertAttributesExcludedFromAAD = ['scheduledTaskId', 'muteAll', 'mutedInstanceIds', 'updatedBy', 'updatedAt', 'executionStatus']; // useful for Pick<RawAlert, AlertAttributesExcludedFromAADType> which is a
// type which is a subset of RawAlert with just attributes excluded from AAD
// useful for Pick<RawAlert, AlertAttributesExcludedFromAADType>

exports.AlertAttributesExcludedFromAAD = AlertAttributesExcludedFromAAD;

function setupSavedObjects(savedObjects, encryptedSavedObjects) {
  savedObjects.registerType({
    name: 'alert',
    hidden: true,
    namespaceType: 'single',
    migrations: (0, _migrations.getMigrations)(encryptedSavedObjects),
    mappings: _mappings.default.alert
  });
  savedObjects.registerType({
    name: 'api_key_pending_invalidation',
    hidden: true,
    namespaceType: 'agnostic',
    mappings: {
      properties: {
        apiKeyId: {
          type: 'keyword'
        },
        createdAt: {
          type: 'date'
        }
      }
    }
  }); // Encrypted attributes

  encryptedSavedObjects.registerType({
    type: 'alert',
    attributesToEncrypt: new Set(['apiKey']),
    attributesToExcludeFromAAD: new Set(AlertAttributesExcludedFromAAD)
  }); // Encrypted attributes

  encryptedSavedObjects.registerType({
    type: 'api_key_pending_invalidation',
    attributesToEncrypt: new Set(['apiKeyId'])
  });
}