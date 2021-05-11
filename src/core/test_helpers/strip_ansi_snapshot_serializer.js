"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripAnsiSnapshotSerializer = void 0;

var _hasAnsi = _interopRequireDefault(require("has-ansi"));

var _stripAnsi = _interopRequireDefault(require("strip-ansi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const stripAnsiSnapshotSerializer = {
  serialize(value) {
    return (0, _stripAnsi.default)(value);
  },

  test(value) {
    return typeof value === 'string' && (0, _hasAnsi.default)(value);
  }

};
exports.stripAnsiSnapshotSerializer = stripAnsiSnapshotSerializer;