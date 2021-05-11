"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogEntryResponseRT = exports.logEntryHitRT = exports.createGetLogEntryQuery = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _typed_json = require("../../../../common/typed_json");

var _elasticsearch_runtime_types = require("../../../utils/elasticsearch_runtime_types");

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


const createGetLogEntryQuery = (logEntryIndex, logEntryId, timestampField, tiebreakerField) => ({
  index: logEntryIndex,
  terminate_after: 1,
  track_scores: false,
  track_total_hits: false,
  body: {
    size: 1,
    query: {
      ids: {
        values: [logEntryId]
      }
    },
    fields: ['*'],
    sort: [{
      [timestampField]: 'desc'
    }, {
      [tiebreakerField]: 'desc'
    }],
    _source: false
  }
});

exports.createGetLogEntryQuery = createGetLogEntryQuery;
const logEntryHitRT = rt.intersection([_elasticsearch_runtime_types.commonHitFieldsRT, rt.type({
  sort: rt.tuple([rt.number, rt.number])
}), rt.partial({
  fields: rt.record(rt.string, _typed_json.jsonArrayRT)
})]);
exports.logEntryHitRT = logEntryHitRT;
const getLogEntryResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  hits: rt.type({
    hits: rt.array(logEntryHitRT)
  })
})]);
exports.getLogEntryResponseRT = getLogEntryResponseRT;