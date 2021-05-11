"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlJobsResponseRT = exports.mlJobRT = exports.createMlJobsQuery = void 0;

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


const createMlJobsQuery = jobIds => ({
  method: 'GET',
  path: `/_ml/anomaly_detectors/${jobIds.join(',')}`,
  query: {
    allow_no_jobs: true
  }
});

exports.createMlJobsQuery = createMlJobsQuery;
const mlJobRT = rt.type({
  job_id: rt.string,
  custom_settings: rt.unknown
});
exports.mlJobRT = mlJobRT;
const mlJobsResponseRT = rt.type({
  jobs: rt.array(mlJobRT)
});
exports.mlJobsResponseRT = mlJobsResponseRT;