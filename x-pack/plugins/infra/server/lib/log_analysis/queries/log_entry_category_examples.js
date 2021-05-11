"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntryCategoryExamplesResponseRT = exports.logEntryCategoryExampleHitRT = exports.createLogEntryCategoryExamplesQuery = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _elasticsearch_runtime_types = require("../../../utils/elasticsearch_runtime_types");

var _common = require("./common");

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


const createLogEntryCategoryExamplesQuery = (indices, timestampField, tiebreakerField, startTime, endTime, categoryQuery, exampleCount) => ({ ..._common.defaultRequestParameters,
  body: {
    query: {
      bool: {
        filter: [{
          range: {
            [timestampField]: {
              gte: startTime,
              lte: endTime
            }
          }
        }, {
          match: {
            message: {
              query: categoryQuery,
              operator: 'AND'
            }
          }
        }]
      }
    },
    sort: [{
      [timestampField]: 'asc'
    }, {
      [tiebreakerField]: 'asc'
    }],
    _source: false,
    fields: ['event.dataset', 'message', 'container.id', 'host.name', 'log.file.path']
  },
  index: indices,
  size: exampleCount
});

exports.createLogEntryCategoryExamplesQuery = createLogEntryCategoryExamplesQuery;
const logEntryCategoryExampleHitRT = rt.type({
  _id: rt.string,
  fields: rt.partial({
    'event.dataset': rt.array(rt.string),
    message: rt.array(rt.string),
    'container.id': rt.array(rt.string),
    'host.name': rt.array(rt.string),
    'log.file.path': rt.array(rt.string)
  }),
  sort: rt.tuple([rt.number, rt.number])
});
exports.logEntryCategoryExampleHitRT = logEntryCategoryExampleHitRT;
const logEntryCategoryExamplesResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  hits: rt.type({
    hits: rt.array(logEntryCategoryExampleHitRT)
  })
})]); // eslint-disable-next-line @typescript-eslint/naming-convention

exports.logEntryCategoryExamplesResponseRT = logEntryCategoryExamplesResponseRT;