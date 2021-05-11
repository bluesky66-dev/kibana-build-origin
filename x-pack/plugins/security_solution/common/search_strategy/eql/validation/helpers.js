"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidationErrors = exports.isValidationErrorResponse = exports.isErrorResponse = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PARSING_ERROR_TYPE = 'parsing_exception';
const VERIFICATION_ERROR_TYPE = 'verification_exception';
const MAPPING_ERROR_TYPE = 'mapping_exception';

const isValidationErrorType = type => type === PARSING_ERROR_TYPE || type === VERIFICATION_ERROR_TYPE || type === MAPPING_ERROR_TYPE;

const isErrorResponse = response => (0, _lodash.has)(response, 'error.type');

exports.isErrorResponse = isErrorResponse;

const isValidationErrorResponse = response => isErrorResponse(response) && isValidationErrorType((0, _lodash.get)(response, 'error.type'));

exports.isValidationErrorResponse = isValidationErrorResponse;

const getValidationErrors = response => response.error.root_cause.filter(cause => isValidationErrorType(cause.type)).map(cause => cause.reason);

exports.getValidationErrors = getValidationErrors;