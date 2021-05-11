"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationIndicesResponsePayloadRT = exports.validationIndicesErrorRT = exports.validationIndicesRequestPayloadRT = exports.validationIndicesFieldSpecificationRT = exports.LOG_ANALYSIS_VALIDATE_INDICES_PATH = void 0;

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


const LOG_ANALYSIS_VALIDATE_INDICES_PATH = '/api/infra/log_analysis/validation/log_entry_rate_indices';
/**
 * Request types
 */

exports.LOG_ANALYSIS_VALIDATE_INDICES_PATH = LOG_ANALYSIS_VALIDATE_INDICES_PATH;
const validationIndicesFieldSpecificationRT = rt.type({
  name: rt.string,
  validTypes: rt.array(rt.string)
});
exports.validationIndicesFieldSpecificationRT = validationIndicesFieldSpecificationRT;
const validationIndicesRequestPayloadRT = rt.type({
  data: rt.type({
    fields: rt.array(validationIndicesFieldSpecificationRT),
    indices: rt.array(rt.string)
  })
});
exports.validationIndicesRequestPayloadRT = validationIndicesRequestPayloadRT;
/**
 * Response types
 * */

const validationIndicesErrorRT = rt.union([rt.type({
  error: rt.literal('INDEX_NOT_FOUND'),
  index: rt.string
}), rt.type({
  error: rt.literal('FIELD_NOT_FOUND'),
  index: rt.string,
  field: rt.string
}), rt.type({
  error: rt.literal('FIELD_NOT_VALID'),
  index: rt.string,
  field: rt.string
})]);
exports.validationIndicesErrorRT = validationIndicesErrorRT;
const validationIndicesResponsePayloadRT = rt.type({
  data: rt.type({
    errors: rt.array(validationIndicesErrorRT)
  })
});
exports.validationIndicesResponsePayloadRT = validationIndicesResponsePayloadRT;