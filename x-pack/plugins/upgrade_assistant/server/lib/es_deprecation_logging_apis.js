"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeprecationLoggingStatus = getDeprecationLoggingStatus;
exports.setDeprecationLogging = setDeprecationLogging;
exports.isDeprecationLoggingEnabled = isDeprecationLoggingEnabled;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getDeprecationLoggingStatus(dataClient) {
  const {
    body: response
  } = await dataClient.asCurrentUser.cluster.getSettings({
    include_defaults: true
  });
  return {
    isEnabled: isDeprecationLoggingEnabled(response)
  };
}

async function setDeprecationLogging(dataClient, isEnabled) {
  const {
    body: response
  } = await dataClient.asCurrentUser.cluster.putSettings({
    body: {
      transient: {
        'logger.deprecation': isEnabled ? 'WARN' : 'ERROR'
      }
    }
  });
  return {
    isEnabled: isDeprecationLoggingEnabled(response)
  };
}

function isDeprecationLoggingEnabled(settings) {
  const deprecationLogLevel = ['default', 'persistent', 'transient'].reduce((currentLogLevel, settingsTier) => (0, _lodash.get)(settings, [settingsTier, 'logger', 'deprecation'], currentLogLevel), 'WARN');
  return ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN'].includes(deprecationLogLevel);
}