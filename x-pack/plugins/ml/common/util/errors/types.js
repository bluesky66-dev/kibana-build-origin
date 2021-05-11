"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEsErrorBody = isEsErrorBody;
exports.isErrorString = isErrorString;
exports.isErrorMessage = isErrorMessage;
exports.isMLResponseError = isMLResponseError;
exports.isBoomError = isBoomError;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isEsErrorBody(error) {
  var _error$error;

  return error && ((_error$error = error.error) === null || _error$error === void 0 ? void 0 : _error$error.reason) !== undefined;
}

function isErrorString(error) {
  return typeof error === 'string';
}

function isErrorMessage(error) {
  return error && error.message !== undefined && typeof error.message === 'string';
}

function isMLResponseError(error) {
  return typeof error.body === 'object' && 'message' in error.body;
}

function isBoomError(error) {
  return error.isBoom === true;
}