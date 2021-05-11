"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogSourceConfigurationResponsePayloadRT = exports.getLogSourceConfigurationErrorResponsePayloadRT = exports.getLogSourceConfigurationSuccessResponsePayloadRT = exports.getLogSourceConfigurationRequestParamsRT = void 0;

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

/**
 * request
 */


const getLogSourceConfigurationRequestParamsRT = rt.type({
  // the id of the source configuration
  sourceId: rt.string
});
exports.getLogSourceConfigurationRequestParamsRT = getLogSourceConfigurationRequestParamsRT;
/**
 * response
 */

const getLogSourceConfigurationSuccessResponsePayloadRT = rt.intersection([rt.type({
  data: _log_source_configuration.logSourceConfigurationRT
}), rt.partial({
  timing: _shared.routeTimingMetadataRT
})]);
exports.getLogSourceConfigurationSuccessResponsePayloadRT = getLogSourceConfigurationSuccessResponsePayloadRT;
const getLogSourceConfigurationErrorResponsePayloadRT = rt.union([_shared.badRequestErrorRT, _shared.forbiddenErrorRT]);
exports.getLogSourceConfigurationErrorResponsePayloadRT = getLogSourceConfigurationErrorResponsePayloadRT;
const getLogSourceConfigurationResponsePayloadRT = rt.union([getLogSourceConfigurationSuccessResponsePayloadRT, getLogSourceConfigurationErrorResponsePayloadRT]);
exports.getLogSourceConfigurationResponsePayloadRT = getLogSourceConfigurationResponsePayloadRT;