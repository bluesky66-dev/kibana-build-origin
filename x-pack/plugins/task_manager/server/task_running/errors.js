"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnrecoverableError = isUnrecoverableError;
exports.throwUnrecoverableError = throwUnrecoverableError;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Unrecoverable

const CODE_UNRECOVERABLE = 'TaskManager/unrecoverable';
const code = Symbol('TaskManagerErrorCode');

function isTaskManagerError(error) {
  return Boolean(error && error[code]);
}

function isUnrecoverableError(error) {
  return isTaskManagerError(error) && error[code] === CODE_UNRECOVERABLE;
}

function throwUnrecoverableError(error) {
  error[code] = CODE_UNRECOVERABLE;
  throw error;
}