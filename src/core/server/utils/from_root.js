"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromRoot = fromRoot;

var _path = require("path");

var _package_json = require("./package_json");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function fromRoot(...args) {
  return (0, _path.resolve)(_package_json.pkg.__dirname, ...args);
}