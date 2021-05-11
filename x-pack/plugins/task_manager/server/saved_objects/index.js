"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;

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


function setupSavedObjects(savedObjects, config) {
  savedObjects.registerType({
    name: 'task',
    namespaceType: 'agnostic',
    hidden: true,
    convertToAliasScript: `ctx._id = ctx._source.type + ':' + ctx._id; ctx._source.remove("kibana")`,
    mappings: _mappings.default.task,
    migrations: _migrations.migrations,
    indexPattern: config.index
  });
}