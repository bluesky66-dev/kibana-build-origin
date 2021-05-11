"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.latestLogEntryCategoriesDatasetsStatsResponseRT = exports.logEntryCategorizerStatsHitRT = exports.logEntryCategoryStatusRT = exports.createLatestLogEntryCategoriesDatasetsStatsQuery = void 0;

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


const createLatestLogEntryCategoriesDatasetsStatsQuery = (logEntryCategoriesJobIds, startTime, endTime, size, afterKey) => ({ ..._common.defaultRequestParameters,
  body: {
    query: {
      bool: {
        filter: [...(0, _common.createJobIdsFilters)(logEntryCategoriesJobIds), ...(0, _common.createResultTypeFilters)(['categorizer_stats']), ...(0, _common.createLogTimeRangeFilters)(startTime, endTime)]
      }
    },
    aggregations: {
      dataset_composite_terms: {
        composite: {
          after: afterKey,
          size,
          sources: [{
            dataset: {
              terms: {
                field: 'partition_field_value',
                missing_bucket: true
              }
            }
          }]
        },
        aggs: {
          categorizer_stats_top_hits: {
            top_hits: {
              size: 1,
              sort: [{
                log_time: 'desc'
              }],
              _source: ['categorization_status', 'categorized_doc_count', 'dead_category_count', 'failed_category_count', 'frequent_category_count', 'job_id', 'log_time', 'rare_category_count', 'total_category_count']
            }
          }
        }
      }
    }
  },
  size: 0
});

exports.createLatestLogEntryCategoriesDatasetsStatsQuery = createLatestLogEntryCategoriesDatasetsStatsQuery;
const logEntryCategoryStatusRT = rt.keyof({
  ok: null,
  warn: null
});
exports.logEntryCategoryStatusRT = logEntryCategoryStatusRT;
const logEntryCategorizerStatsHitRT = rt.type({
  _source: rt.type({
    categorization_status: logEntryCategoryStatusRT,
    categorized_doc_count: rt.number,
    dead_category_count: rt.number,
    failed_category_count: rt.number,
    frequent_category_count: rt.number,
    job_id: rt.string,
    log_time: rt.number,
    rare_category_count: rt.number,
    total_category_count: rt.number
  })
});
exports.logEntryCategorizerStatsHitRT = logEntryCategorizerStatsHitRT;
const compositeDatasetKeyRT = rt.union([rt.type({
  dataset: rt.union([rt.string, rt.null])
}), rt.undefined]);
const logEntryCategoryDatasetStatsBucketRT = rt.type({
  key: compositeDatasetKeyRT,
  categorizer_stats_top_hits: rt.type({
    hits: rt.type({
      hits: rt.array(logEntryCategorizerStatsHitRT)
    })
  })
});
const latestLogEntryCategoriesDatasetsStatsResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.partial({
  aggregations: rt.type({
    dataset_composite_terms: rt.type({
      after_key: compositeDatasetKeyRT,
      buckets: rt.array(logEntryCategoryDatasetStatsBucketRT)
    })
  })
})]);
exports.latestLogEntryCategoriesDatasetsStatsResponseRT = latestLogEntryCategoriesDatasetsStatsResponseRT;