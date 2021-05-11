"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleError = handleError;

var _boom = require("@hapi/boom");

var _known_errors = require("./known_errors");

var _auth_errors = require("./auth_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleError(err, req) {
  req && req.logger && req.logger.error(err); // specially handle auth errors

  if ((0, _auth_errors.isAuthError)(err)) {
    return (0, _auth_errors.handleAuthError)(err);
  } // specially "service unavailable" errors


  if ((0, _known_errors.isKnownError)(err)) {
    return (0, _known_errors.handleKnownError)(err);
  }

  if (err.isBoom) {
    return err;
  } // boom expects err.message, not err.msg


  if (err.msg) {
    err.message = err.msg;
    delete err.msg;
  }

  const statusCode = err.isBoom ? err.output.statusCode : err.statusCode; // wrap the error; defaults to statusCode = 500 if statusCode is undefined

  return (0, _boom.boomify)(err, {
    statusCode,
    message: err.message
  });
}