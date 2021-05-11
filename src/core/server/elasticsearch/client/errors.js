"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isResponseError = isResponseError;
exports.isUnauthorizedError = isUnauthorizedError;

var _errors = require("@elastic/elasticsearch/lib/errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isResponseError(error) {
  return error instanceof _errors.ResponseError;
}

function isUnauthorizedError(error) {
  return isResponseError(error) && error.statusCode === 401;
}