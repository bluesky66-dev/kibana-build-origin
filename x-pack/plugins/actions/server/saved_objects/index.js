"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;
exports.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE = exports.ALERT_SAVED_OBJECT_TYPE = exports.ACTION_SAVED_OBJECT_TYPE = void 0;

var _mappings = _interopRequireDefault(require("./mappings.json"));

var _migrations = require("./migrations");

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


const ACTION_SAVED_OBJECT_TYPE = 'action';
exports.ACTION_SAVED_OBJECT_TYPE = ACTION_SAVED_OBJECT_TYPE;
const ALERT_SAVED_OBJECT_TYPE = 'alert';
exports.ALERT_SAVED_OBJECT_TYPE = ALERT_SAVED_OBJECT_TYPE;
const ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE = 'action_task_params';
exports.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE = ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE;

function setupSavedObjects(savedObjects, encryptedSavedObjects) {
  savedObjects.registerType({
    name: ACTION_SAVED_OBJECT_TYPE,
    hidden: true,
    namespaceType: 'single',
    mappings: _mappings.default.action,
    migrations: (0, _migrations.getMigrations)(encryptedSavedObjects)
  }); // Encrypted attributes
  // - `secrets` properties will be encrypted
  // - `config` will be included in AAD
  // - everything else excluded from AAD

  encryptedSavedObjects.registerType({
    type: ACTION_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['secrets']),
    attributesToExcludeFromAAD: new Set(['name'])
  });
  savedObjects.registerType({
    name: ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE,
    hidden: true,
    namespaceType: 'single',
    mappings: _mappings.default.action_task_params
  });
  encryptedSavedObjects.registerType({
    type: ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set(['apiKey'])
  });
}