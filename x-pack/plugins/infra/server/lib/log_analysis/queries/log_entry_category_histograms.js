"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntryCategoryHistogramsResponseRT = exports.logEntryCategoryFilterBucketRT = exports.createLogEntryCategoryHistogramsQuery = void 0;

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


const createLogEntryCategoryHistogramsQuery = (logEntryCategoriesJobId, categoryIds, startTime, endTime, bucketCount) => ({ ..._common.defaultRequestParameters,
  body: {
    query: {
      bool: {
        filter: [...(0, _common.createJobIdFilters)(logEntryCategoriesJobId), ...(0, _common.createTimeRangeFilters)(startTime, endTime), ...(0, _common.createResultTypeFilters)(['model_plot']), ...createCategoryFilters(categoryIds)]
      }
    },
    aggs: {
      filters_categories: {
        filters: createCategoryFiltersAggregation(categoryIds),
        aggs: {
          histogram_timestamp: createHistogramAggregation(startTime, endTime, bucketCount)
        }
      }
    }
  },
  size: 0
});

exports.createLogEntryCategoryHistogramsQuery = createLogEntryCategoryHistogramsQuery;

const createCategoryFilters = categoryIds => [{
  terms: {
    by_field_value: categoryIds
  }
}];

const createCategoryFiltersAggregation = categoryIds => ({
  filters: categoryIds.reduce((categoryFilters, categoryId) => ({ ...categoryFilters,
    [`${categoryId}`]: {
      term: {
        by_field_value: categoryId
      }
    }
  }), {})
});

const createHistogramAggregation = (startTime, endTime, bucketCount) => {
  const bucketDuration = Math.round((endTime - startTime) / bucketCount);
  return {
    histogram: {
      field: 'timestamp',
      interval: bucketDuration,
      offset: startTime
    },
    meta: {
      bucketDuration
    },
    aggs: {
      sum_actual: {
        sum: {
          field: 'actual'
        }
      }
    }
  };
};

const logEntryCategoryFilterBucketRT = rt.type({
  doc_count: rt.number,
  histogram_timestamp: rt.type({
    meta: rt.type({
      bucketDuration: rt.number
    }),
    buckets: rt.array(rt.type({
      key: rt.number,
      doc_count: rt.number,
      sum_actual: rt.type({
        value: rt.number
      })
    }))
  })
});
exports.logEntryCategoryFilterBucketRT = logEntryCategoryFilterBucketRT;
const logEntryCategoryHistogramsResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  aggregations: rt.type({
    filters_categories: rt.type({
      buckets: rt.record(rt.string, logEntryCategoryFilterBucketRT)
    })
  })
})]);
exports.logEntryCategoryHistogramsResponseRT = logEntryCategoryHistogramsResponseRT;