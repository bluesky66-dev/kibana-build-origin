"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapError = wrapError;

var _boom = require("@hapi/boom");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function wrapError(error) {
  var _error$status;

  const boom = (0, _boom.isBoom)(error) ? error : (0, _boom.boomify)(error, {
    statusCode: (_error$status = error.status) !== null && _error$status !== void 0 ? _error$status : error.statusCode
  });
  const statusCode = boom.output.statusCode;
  return {
    body: {
      message: boom,
      ...(statusCode !== 500 && error.body ? {
        attributes: {
          body: error.body
        }
      } : {})
    },
    headers: boom.output.headers,
    statusCode
  };
}