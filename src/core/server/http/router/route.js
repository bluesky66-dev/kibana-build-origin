"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSafeMethod = isSafeMethod;
exports.validBodyOutput = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isSafeMethod(method) {
  return method === 'get' || method === 'options';
}
/**
 * Set of HTTP methods changing the state of the server.
 * @public
 */


/**
 * The set of valid body.output
 * @public
 */
const validBodyOutput = ['data', 'stream'];
/**
 * The set of supported parseable Content-Types
 * @public
 */

exports.validBodyOutput = validBodyOutput;