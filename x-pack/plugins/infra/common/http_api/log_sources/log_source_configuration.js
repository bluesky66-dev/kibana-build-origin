"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logSourceConfigurationRT = exports.logSourceConfigurationPropertiesRT = exports.logSourceColumnConfigurationRT = exports.logSourceFieldColumnConfigurationRT = exports.logSourceConfigurationOriginRT = exports.getLogSourceConfigurationPath = exports.LOG_SOURCE_CONFIGURATION_PATH = exports.LOG_SOURCE_CONFIGURATION_PATH_PREFIX = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LOG_SOURCE_CONFIGURATION_PATH_PREFIX = '/api/infra/log_source_configurations';
exports.LOG_SOURCE_CONFIGURATION_PATH_PREFIX = LOG_SOURCE_CONFIGURATION_PATH_PREFIX;
const LOG_SOURCE_CONFIGURATION_PATH = `${LOG_SOURCE_CONFIGURATION_PATH_PREFIX}/{sourceId}`;
exports.LOG_SOURCE_CONFIGURATION_PATH = LOG_SOURCE_CONFIGURATION_PATH;

const getLogSourceConfigurationPath = sourceId => `${LOG_SOURCE_CONFIGURATION_PATH_PREFIX}/${sourceId}`;

exports.getLogSourceConfigurationPath = getLogSourceConfigurationPath;
const logSourceConfigurationOriginRT = rt.keyof({
  fallback: null,
  internal: null,
  stored: null
});
exports.logSourceConfigurationOriginRT = logSourceConfigurationOriginRT;
const logSourceFieldsConfigurationRT = rt.strict({
  container: rt.string,
  host: rt.string,
  pod: rt.string,
  timestamp: rt.string,
  tiebreaker: rt.string
});
const logSourceCommonColumnConfigurationRT = rt.strict({
  id: rt.string
});
const logSourceTimestampColumnConfigurationRT = rt.strict({
  timestampColumn: logSourceCommonColumnConfigurationRT
});
const logSourceMessageColumnConfigurationRT = rt.strict({
  messageColumn: logSourceCommonColumnConfigurationRT
});
const logSourceFieldColumnConfigurationRT = rt.strict({
  fieldColumn: rt.intersection([logSourceCommonColumnConfigurationRT, rt.strict({
    field: rt.string
  })])
});
exports.logSourceFieldColumnConfigurationRT = logSourceFieldColumnConfigurationRT;
const logSourceColumnConfigurationRT = rt.union([logSourceTimestampColumnConfigurationRT, logSourceMessageColumnConfigurationRT, logSourceFieldColumnConfigurationRT]);
exports.logSourceColumnConfigurationRT = logSourceColumnConfigurationRT;
const logSourceConfigurationPropertiesRT = rt.strict({
  name: rt.string,
  description: rt.string,
  logAlias: rt.string,
  fields: logSourceFieldsConfigurationRT,
  logColumns: rt.array(logSourceColumnConfigurationRT)
});
exports.logSourceConfigurationPropertiesRT = logSourceConfigurationPropertiesRT;
const logSourceConfigurationRT = rt.exact(rt.intersection([rt.type({
  id: rt.string,
  origin: logSourceConfigurationOriginRT,
  configuration: logSourceConfigurationPropertiesRT
}), rt.partial({
  updatedAt: rt.number,
  version: rt.string
})]));
exports.logSourceConfigurationRT = logSourceConfigurationRT;