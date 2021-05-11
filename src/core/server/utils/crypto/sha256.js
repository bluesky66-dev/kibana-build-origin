"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSHA256Hash = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createSHA256Hash = (input, outputEncoding = 'hex') => {
  let data;

  if (typeof input === 'string') {
    data = Buffer.from(input, 'utf8');
  } else {
    data = input;
  }

  return _crypto.default.createHash('sha256').update(data).digest(outputEncoding);
};

exports.createSHA256Hash = createSHA256Hash;