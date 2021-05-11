"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepCloneWithBuffers = deepCloneWithBuffers;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// We should add `any` return type to overcome bug in lodash types, customizer
// in lodash 3.* can return `undefined` if cloning is handled by the lodash, but
// type of the customizer function doesn't expect that.
function cloneBuffersCustomizer(val) {
  if (Buffer.isBuffer(val)) {
    return Buffer.from(val);
  }
}

function deepCloneWithBuffers(val) {
  return (0, _lodash.cloneDeepWith)(val, cloneBuffersCustomizer);
}