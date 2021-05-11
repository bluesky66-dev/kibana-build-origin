"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntryDatasetsResponseRT = exports.createLogEntryDatasetsQuery = void 0;

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


const createLogEntryDatasetsQuery = (jobIds, startTime, endTime, size, afterKey) => ({ ..._common.defaultRequestParameters,
  body: {
    query: {
      bool: {
        filter: [...(0, _common.createJobIdsFilters)(jobIds), ...(0, _common.createTimeRangeFilters)(startTime, endTime), ...(0, _common.createResultTypeFilters)(['model_plot'])]
      }
    },
    aggs: {
      dataset_buckets: {
        composite: {
          after: afterKey,
          size,
          sources: [{
            dataset: {
              terms: {
                field: 'partition_field_value',
                order: 'asc'
              }
            }
          }]
        }
      }
    }
  },
  size: 0
});

exports.createLogEntryDatasetsQuery = createLogEntryDatasetsQuery;
const compositeDatasetKeyRT = rt.type({
  dataset: rt.string
});
const logEntryDatasetBucketRT = rt.type({
  key: compositeDatasetKeyRT
});
const logEntryDatasetsResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.partial({
  aggregations: rt.type({
    dataset_buckets: rt.intersection([rt.type({
      buckets: rt.array(logEntryDatasetBucketRT)
    }), rt.partial({
      after_key: compositeDatasetKeyRT
    })])
  })
})]);
exports.logEntryDatasetsResponseRT = logEntryDatasetsResponseRT;