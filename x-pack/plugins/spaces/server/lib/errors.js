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
  const boom = (0, _boom.isBoom)(error) ? error : (0, _boom.boomify)(error);
  return {
    body: boom,
    headers: boom.output.headers,
    statusCode: boom.output.statusCode
  };
}