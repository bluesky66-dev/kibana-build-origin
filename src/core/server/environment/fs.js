"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exists = exports.mkdir = exports.writeFile = exports.readFile = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const readFile = (0, _util.promisify)(_fs.default.readFile);
exports.readFile = readFile;
const writeFile = (0, _util.promisify)(_fs.default.writeFile);
exports.writeFile = writeFile;
const mkdir = (0, _util.promisify)(_fs.default.mkdir);
exports.mkdir = mkdir;
const exists = (0, _util.promisify)(_fs.default.exists);
exports.exists = exists;