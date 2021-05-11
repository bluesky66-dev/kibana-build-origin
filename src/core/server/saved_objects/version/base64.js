"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeBase64 = exports.decodeBase64 = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const decodeBase64 = base64 => Buffer.from(base64, 'base64').toString('utf8');

exports.decodeBase64 = decodeBase64;

const encodeBase64 = utf8 => Buffer.from(utf8, 'utf8').toString('base64');

exports.encodeBase64 = encodeBase64;