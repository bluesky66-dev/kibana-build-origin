"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSpanGroupingSupported = isSpanGroupingSupported;
exports.SERVICE_MAP_TIMEOUT_ERROR = exports.invalidLicenseMessage = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const invalidLicenseMessage = _i18n.i18n.translate('xpack.apm.serviceMap.invalidLicenseMessage', {
  defaultMessage: "In order to access Service Maps, you must be subscribed to an Elastic Platinum license. With it, you'll have the ability to visualize your entire application stack along with your APM data."
});

exports.invalidLicenseMessage = invalidLicenseMessage;
const NONGROUPED_SPANS = {
  aws: ['servicename'],
  cache: ['all'],
  db: ['all'],
  external: ['graphql', 'grpc', 'websocket'],
  messaging: ['all'],
  template: ['handlebars']
};

function isSpanGroupingSupported(type, subtype) {
  if (!type || !(type in NONGROUPED_SPANS)) {
    return true;
  }

  return !NONGROUPED_SPANS[type].some(nongroupedSubType => nongroupedSubType === 'all' || nongroupedSubType === subtype);
}

const SERVICE_MAP_TIMEOUT_ERROR = 'ServiceMapTimeoutError';
exports.SERVICE_MAP_TIMEOUT_ERROR = SERVICE_MAP_TIMEOUT_ERROR;