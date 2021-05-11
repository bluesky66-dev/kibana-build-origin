"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;

var _mappings = _interopRequireDefault(require("./mappings.json"));

var _migrations = require("./migrations");

var _saved_objects = require("../../common/types/saved_objects");

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


function setupSavedObjects(savedObjects) {
  savedObjects.registerType({
    name: _saved_objects.ML_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'multiple',
    migrations: _migrations.migrations,
    mappings: _mappings.default.job
  });
}