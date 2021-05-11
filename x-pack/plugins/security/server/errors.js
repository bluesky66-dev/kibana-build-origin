"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapError = wrapError;
exports.wrapIntoCustomErrorResponse = wrapIntoCustomErrorResponse;
exports.getErrorStatusCode = getErrorStatusCode;
exports.getDetailedErrorMessage = getDetailedErrorMessage;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _elasticsearch = require("@elastic/elasticsearch");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function wrapError(error) {
  return _boom.default.boomify(error, {
    statusCode: getErrorStatusCode(error)
  });
}
/**
 * Wraps error into error suitable for Core's custom error response.
 * @param error Any error instance.
 */


function wrapIntoCustomErrorResponse(error) {
  const wrappedError = wrapError(error);
  return {
    body: wrappedError,
    headers: wrappedError.output.headers,
    statusCode: wrappedError.output.statusCode
  };
}
/**
 * Extracts error code from Boom and Elasticsearch "native" errors.
 * @param error Error instance to extract status code from.
 */


function getErrorStatusCode(error) {
  if (error instanceof _elasticsearch.errors.ResponseError) {
    return error.statusCode;
  }

  return _boom.default.isBoom(error) ? error.output.statusCode : error.statusCode || error.status;
}
/**
 * Extracts detailed error message from Boom and Elasticsearch "native" errors. It's supposed to be
 * only logged on the server side and never returned to the client as it may contain sensitive
 * information.
 * @param error Error instance to extract message from.
 */


function getDetailedErrorMessage(error) {
  if (error instanceof _elasticsearch.errors.ResponseError) {
    return JSON.stringify(error.body);
  }

  if (_boom.default.isBoom(error)) {
    return JSON.stringify(error.output.payload);
  }

  return error.message;
}