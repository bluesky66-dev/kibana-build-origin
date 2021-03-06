"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pkg = void 0;

var _path = require("path");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const pkg = {
  __filename: require.resolve('../../../../package.json'),
  __dirname: (0, _path.dirname)(require.resolve('../../../../package.json')),
  ...require('../../../../package.json')
};
exports.pkg = pkg;