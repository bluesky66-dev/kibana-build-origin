"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkParam = checkParam;
exports.MissingRequiredError = MissingRequiredError;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Helper for checking a param's value is defined
 * @param param - anything
 * @param context {String} calling context used in the error message
 */

function checkParam(param, context) {
  if (!param) {
    throw new MissingRequiredError(context);
  }
}
/* Constructor for custom error type used for:
 * - giving an error a stock message prefix
 * - verification in unit tests
 * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */


function MissingRequiredError(param) {
  this.name = 'MissingRequiredError';
  this.message = `Missing required parameter or field: ${param}`;
  this.stack = new Error().stack;
}

MissingRequiredError.prototype = Object.create(Error.prototype);
MissingRequiredError.prototype.constructor = MissingRequiredError;