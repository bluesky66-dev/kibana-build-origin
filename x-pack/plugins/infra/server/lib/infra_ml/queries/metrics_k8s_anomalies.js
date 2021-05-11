"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricsK8sAnomaliesResponseRT = exports.metricsK8sAnomalyHitRT = exports.createMetricsK8sAnomaliesQuery = void 0;

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
// TODO: Reassess validity of this against ML docs


const TIEBREAKER_FIELD = '_doc';
const sortToMlFieldMap = {
  dataset: 'partition_field_value',
  anomalyScore: 'record_score',
  startTime: 'timestamp'
};

const createMetricsK8sAnomaliesQuery = ({
  jobIds,
  anomalyThreshold,
  startTime,
  endTime,
  sort,
  pagination,
  influencerFilter
}) => {
  const {
    field
  } = sort;
  const {
    pageSize
  } = pagination;
  const filters = [...(0, _common.createJobIdsFilters)(jobIds), ...(0, _common.createAnomalyScoreFilter)(anomalyThreshold), ...(0, _common.createTimeRangeFilters)(startTime, endTime), ...(0, _common.createResultTypeFilters)(['record'])];
  const influencerQuery = influencerFilter ? {
    must: (0, _common.createInfluencerFilter)(influencerFilter)
  } : {};
  const sourceFields = ['job_id', 'record_score', 'typical', 'actual', 'partition_field_value', 'timestamp', 'bucket_span', 'by_field_value', 'influencers.influencer_field_name', 'influencers.influencer_field_values'];
  const {
    querySortDirection,
    queryCursor
  } = parsePaginationCursor(sort, pagination);
  const sortOptions = [{
    [sortToMlFieldMap[field]]: querySortDirection
  }, {
    [TIEBREAKER_FIELD]: querySortDirection
  } // Tiebreaker
  ];
  const resultsQuery = { ..._common.defaultRequestParameters,
    body: {
      query: {
        bool: {
          filter: filters,
          ...influencerQuery
        }
      },
      search_after: queryCursor,
      sort: sortOptions,
      size: pageSize,
      _source: sourceFields
    }
  };
  return resultsQuery;
};

exports.createMetricsK8sAnomaliesQuery = createMetricsK8sAnomaliesQuery;
const metricsK8sAnomalyHitRT = rt.type({
  _id: rt.string,
  _source: rt.intersection([rt.type({
    job_id: rt.string,
    record_score: rt.number,
    typical: rt.array(rt.number),
    actual: rt.array(rt.number),
    influencers: rt.array(rt.type({
      influencer_field_name: rt.string,
      influencer_field_values: rt.array(rt.string)
    })),
    bucket_span: rt.number,
    timestamp: rt.number
  }), rt.partial({
    by_field_value: rt.string
  })]),
  sort: rt.tuple([rt.union([rt.string, rt.number]), rt.union([rt.string, rt.number])])
});
exports.metricsK8sAnomalyHitRT = metricsK8sAnomalyHitRT;
const metricsK8sAnomaliesResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  hits: rt.type({
    hits: rt.array(metricsK8sAnomalyHitRT)
  })
})]);
exports.metricsK8sAnomaliesResponseRT = metricsK8sAnomaliesResponseRT;

const parsePaginationCursor = (sort, pagination) => {
  const {
    cursor
  } = pagination;
  const {
    direction
  } = sort;

  if (!cursor) {
    return {
      querySortDirection: direction,
      queryCursor: undefined
    };
  } // We will always use ES's search_after to paginate, to mimic "search_before" behaviour we
  // need to reverse the user's chosen search direction for the ES query.


  if ('searchBefore' in cursor) {
    return {
      querySortDirection: direction === 'desc' ? 'asc' : 'desc',
      queryCursor: cursor.searchBefore
    };
  } else {
    return {
      querySortDirection: direction,
      queryCursor: cursor.searchAfter
    };
  }
};