"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isKnownError = isKnownError;
exports.handleKnownError = handleKnownError;

var _boom = require("@hapi/boom");

var _i18n = require("@kbn/i18n");

var _custom_errors = require("./custom_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Check if the given error message is a known "safe" type of error
 * in which case we want to give the status as 503 and show the error message.
 *
 * This is necessary because Boom's default status code is 500, and has
 * behavior to suppress the original message to the client for security
 * reasons.
 */


const KNOWN_ERROR_STATUS_CODE = 503;
const mapTypeMessage = {
  ConnectionFault: _i18n.i18n.translate('xpack.monitoring.errors.connectionFaultErrorMessage', {
    defaultMessage: 'Check the Elasticsearch Monitoring cluster network connection and refer to the Kibana logs for more information.'
  }),
  NoConnections: _i18n.i18n.translate('xpack.monitoring.errors.noConnectionsErrorMessage', {
    defaultMessage: 'Check the Elasticsearch Monitoring cluster network connection and refer to the Kibana logs for more information.'
  }),
  StatusCodeError: _i18n.i18n.translate('xpack.monitoring.errors.statusCodeErrorMessage', {
    defaultMessage: 'Check the Elasticsearch Monitoring cluster network connection or the load level of the nodes.'
  })
};
const customErrors = [_custom_errors.MonitoringLicenseError];

function isKnownError(err) {
  for (const customError of customErrors) {
    if (err instanceof customError) {
      return true;
    }
  }

  const knownTypes = Object.keys(mapTypeMessage);
  return knownTypes.includes(err.constructor.name);
}

function handleKnownError(err) {
  err.message = err.message + ': ' + (err.description || mapTypeMessage[err.constructor.name]);
  let statusCode = err.statusCode || err.status;
  statusCode = statusCode !== 500 ? statusCode : KNOWN_ERROR_STATUS_CODE;
  return (0, _boom.boomify)(err, {
    statusCode
  });
}