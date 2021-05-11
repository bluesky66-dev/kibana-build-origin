"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogSourceStatusSuccessResponsePayloadRT = exports.getLogSourceStatusRequestParamsRT = exports.getLogSourceStatusPath = exports.LOG_SOURCE_STATUS_PATH = exports.LOG_SOURCE_STATUS_PATH_SUFFIX = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _shared = require("../shared");

var _log_source_configuration = require("./log_source_configuration");

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


const LOG_SOURCE_STATUS_PATH_SUFFIX = 'status';
exports.LOG_SOURCE_STATUS_PATH_SUFFIX = LOG_SOURCE_STATUS_PATH_SUFFIX;
const LOG_SOURCE_STATUS_PATH = `${_log_source_configuration.LOG_SOURCE_CONFIGURATION_PATH}/${LOG_SOURCE_STATUS_PATH_SUFFIX}`;
exports.LOG_SOURCE_STATUS_PATH = LOG_SOURCE_STATUS_PATH;

const getLogSourceStatusPath = sourceId => `${(0, _log_source_configuration.getLogSourceConfigurationPath)(sourceId)}/${LOG_SOURCE_STATUS_PATH_SUFFIX}`;
/**
 * request
 */


exports.getLogSourceStatusPath = getLogSourceStatusPath;
const getLogSourceStatusRequestParamsRT = rt.type({
  // the id of the source configuration
  sourceId: rt.string
});
exports.getLogSourceStatusRequestParamsRT = getLogSourceStatusRequestParamsRT;
/**
 * response
 */

const logIndexFieldRT = rt.strict({
  name: rt.string,
  type: rt.string,
  searchable: rt.boolean,
  aggregatable: rt.boolean
});
const logIndexStatusRT = rt.keyof({
  missing: null,
  empty: null,
  available: null
});
const logSourceStatusRT = rt.strict({
  logIndexFields: rt.array(logIndexFieldRT),
  logIndexStatus: logIndexStatusRT
});
const getLogSourceStatusSuccessResponsePayloadRT = rt.intersection([rt.type({
  data: logSourceStatusRT
}), rt.partial({
  timing: _shared.routeTimingMetadataRT
})]);
exports.getLogSourceStatusSuccessResponsePayloadRT = getLogSourceStatusSuccessResponsePayloadRT;