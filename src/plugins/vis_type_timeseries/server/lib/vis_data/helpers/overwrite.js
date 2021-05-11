"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overwrite = overwrite;

var _setValue = _interopRequireDefault(require("set-value"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Set path in obj. Behaves like lodash `set`
 * @param obj The object to mutate
 * @param path The path of the sub-property to set
 * @param val The value to set the sub-property to
 */
function overwrite(obj, path, val) {
  (0, _setValue.default)(obj, path, undefined);
  (0, _setValue.default)(obj, path, val);
}