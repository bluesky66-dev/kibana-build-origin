"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLogEntryDatasetsResponsePayloadRT = exports.validateLogEntryDatasetsRequestPayloadRT = exports.LOG_ANALYSIS_VALIDATE_DATASETS_PATH = void 0;

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


const LOG_ANALYSIS_VALIDATE_DATASETS_PATH = '/api/infra/log_analysis/validation/log_entry_datasets';
/**
 * Request types
 */

exports.LOG_ANALYSIS_VALIDATE_DATASETS_PATH = LOG_ANALYSIS_VALIDATE_DATASETS_PATH;
const validateLogEntryDatasetsRequestPayloadRT = rt.type({
  data: rt.type({
    indices: rt.array(rt.string),
    timestampField: rt.string,
    startTime: rt.number,
    endTime: rt.number
  })
});
exports.validateLogEntryDatasetsRequestPayloadRT = validateLogEntryDatasetsRequestPayloadRT;
/**
 * Response types
 * */

const logEntryDatasetsEntryRT = rt.strict({
  indexName: rt.string,
  datasets: rt.array(rt.string)
});
const validateLogEntryDatasetsResponsePayloadRT = rt.type({
  data: rt.type({
    datasets: rt.array(logEntryDatasetsEntryRT)
  })
});
exports.validateLogEntryDatasetsResponsePayloadRT = validateLogEntryDatasetsResponsePayloadRT;