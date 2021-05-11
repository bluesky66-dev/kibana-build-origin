"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntryAnomaliesResponseRT = exports.logEntryAnomalyHitRT = exports.createLogEntryAnomaliesQuery = void 0;

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

const createLogEntryAnomaliesQuery = (jobIds, startTime, endTime, sort, pagination, datasets) => {
  const {
    field
  } = sort;
  const {
    pageSize
  } = pagination;
  const filters = [...(0, _common.createJobIdsFilters)(jobIds), ...(0, _common.createTimeRangeFilters)(startTime, endTime), ...(0, _common.createResultTypeFilters)(['record']), ...(0, _common.createDatasetsFilters)(datasets)];
  const fields = ['job_id', 'record_score', 'typical', 'actual', 'partition_field_value', {
    field: 'timestamp',
    format: 'epoch_millis'
  }, 'bucket_span', 'by_field_value'];
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
          filter: filters
        }
      },
      search_after: queryCursor,
      sort: sortOptions,
      size: pageSize,
      _source: false,
      fields
    }
  };
  return resultsQuery;
};

exports.createLogEntryAnomaliesQuery = createLogEntryAnomaliesQuery;
const logEntryAnomalyHitRT = rt.type({
  _id: rt.string,
  fields: rt.intersection([rt.type({
    job_id: rt.array(rt.string),
    record_score: rt.array(rt.number),
    typical: rt.array(rt.number),
    actual: rt.array(rt.number),
    partition_field_value: rt.array(rt.string),
    bucket_span: rt.array(rt.number),
    timestamp: rt.array(rt.string)
  }), rt.partial({
    by_field_value: rt.array(rt.string)
  })]),
  sort: rt.tuple([rt.union([rt.string, rt.number]), rt.union([rt.string, rt.number])])
});
exports.logEntryAnomalyHitRT = logEntryAnomalyHitRT;
const logEntryAnomaliesResponseRT = rt.intersection([_elasticsearch_runtime_types.commonSearchSuccessResponseFieldsRT, rt.type({
  hits: rt.type({
    hits: rt.array(logEntryAnomalyHitRT)
  })
})]);
exports.logEntryAnomaliesResponseRT = logEntryAnomaliesResponseRT;

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