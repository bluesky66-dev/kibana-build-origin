"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPartialResponse = exports.isCompleteResponse = exports.isErrorResponse = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @returns true if response had an error while executing in ES
 */
const isErrorResponse = response => {
  return !response || !response.isRunning && !!response.isPartial;
};
/**
 * @returns true if response is completed successfully
 */


exports.isErrorResponse = isErrorResponse;

const isCompleteResponse = response => {
  return Boolean(response && !response.isRunning && !response.isPartial);
};
/**
 * @returns true if request is still running an/d response contains partial results
 */


exports.isCompleteResponse = isCompleteResponse;

const isPartialResponse = response => {
  return Boolean(response && response.isRunning && response.isPartial);
};

exports.isPartialResponse = isPartialResponse;