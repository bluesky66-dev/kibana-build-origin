"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeSeriesQuery = timeSeriesQuery;
Object.defineProperty(exports, "TimeSeriesQuery", {
  enumerable: true,
  get: function () {
    return _time_series_types.TimeSeriesQuery;
  }
});
Object.defineProperty(exports, "TimeSeriesResult", {
  enumerable: true,
  get: function () {
    return _time_series_types.TimeSeriesResult;
  }
});

var _index = require("../index");

var _date_range_info = require("./date_range_info");

var _time_series_types = require("./time_series_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function timeSeriesQuery(params) {
  const {
    logger,
    callCluster,
    query: queryParams
  } = params;
  const {
    index,
    timeWindowSize,
    timeWindowUnit,
    interval,
    timeField,
    dateStart,
    dateEnd
  } = queryParams;
  const window = `${timeWindowSize}${timeWindowUnit}`;
  const dateRangeInfo = (0, _date_range_info.getDateRangeInfo)({
    dateStart,
    dateEnd,
    window,
    interval
  }); // core query
  // Constructing a typesafe ES query in JS is problematic, use any escapehatch for now
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const esQuery = {
    index,
    body: {
      size: 0,
      query: {
        bool: {
          filter: {
            range: {
              [timeField]: {
                gte: dateRangeInfo.dateStart,
                lt: dateRangeInfo.dateEnd,
                format: 'strict_date_time'
              }
            }
          }
        }
      } // aggs: {...}, filled in below

    },
    ignoreUnavailable: true,
    allowNoIndices: true,
    ignore: [404]
  }; // add the aggregations

  const {
    aggType,
    aggField,
    termField,
    termSize
  } = queryParams;
  const isCountAgg = aggType === 'count';
  const isGroupAgg = !!termField;
  let aggParent = esQuery.body; // first, add a group aggregation, if requested

  if (isGroupAgg) {
    aggParent.aggs = {
      groupAgg: {
        terms: {
          field: termField,
          size: termSize || _index.DEFAULT_GROUPS
        }
      }
    }; // if not count add an order

    if (!isCountAgg) {
      const sortOrder = aggType === 'min' ? 'asc' : 'desc';
      aggParent.aggs.groupAgg.terms.order = {
        sortValueAgg: sortOrder
      };
    }

    aggParent = aggParent.aggs.groupAgg;
  } // next, add the time window aggregation


  aggParent.aggs = {
    dateAgg: {
      date_range: {
        field: timeField,
        format: 'strict_date_time',
        ranges: dateRangeInfo.dateRanges
      }
    }
  }; // if not count, add a sorted value agg

  if (!isCountAgg) {
    aggParent.aggs.sortValueAgg = {
      [aggType]: {
        field: aggField
      }
    };
  }

  aggParent = aggParent.aggs.dateAgg; // finally, the metric aggregation, if requested

  if (!isCountAgg) {
    aggParent.aggs = {
      metricAgg: {
        [aggType]: {
          field: aggField
        }
      }
    };
  }

  let esResult;
  const logPrefix = 'indexThreshold timeSeriesQuery: callCluster';
  logger.debug(`${logPrefix} call: ${JSON.stringify(esQuery)}`); // note there are some commented out console.log()'s below, which are left
  // in, as they are VERY useful when debugging these queries; debug logging
  // isn't as nice since it's a single long JSON line.
  // console.log('time_series_query.ts request\n', JSON.stringify(esQuery, null, 4));

  try {
    esResult = await callCluster('search', esQuery);
  } catch (err) {
    // console.log('time_series_query.ts error\n', JSON.stringify(err, null, 4));
    logger.warn(`${logPrefix} error: ${err.message}`);
    return {
      results: []
    };
  } // console.log('time_series_query.ts response\n', JSON.stringify(esResult, null, 4));


  logger.debug(`${logPrefix} result: ${JSON.stringify(esResult)}`);
  return getResultFromEs(isCountAgg, isGroupAgg, esResult);
}

function getResultFromEs(isCountAgg, isGroupAgg, esResult) {
  var _aggregations$groupAg;

  const aggregations = (esResult === null || esResult === void 0 ? void 0 : esResult.aggregations) || {}; // add a fake 'all documents' group aggregation, if a group aggregation wasn't used

  if (!isGroupAgg) {
    const dateAgg = aggregations.dateAgg || {};
    aggregations.groupAgg = {
      buckets: [{
        key: 'all documents',
        dateAgg
      }]
    };
    delete aggregations.dateAgg;
  }

  const groupBuckets = ((_aggregations$groupAg = aggregations.groupAgg) === null || _aggregations$groupAg === void 0 ? void 0 : _aggregations$groupAg.buckets) || [];
  const result = {
    results: []
  };

  for (const groupBucket of groupBuckets) {
    var _groupBucket$dateAgg;

    const groupName = `${groupBucket === null || groupBucket === void 0 ? void 0 : groupBucket.key}`;
    const dateBuckets = (groupBucket === null || groupBucket === void 0 ? void 0 : (_groupBucket$dateAgg = groupBucket.dateAgg) === null || _groupBucket$dateAgg === void 0 ? void 0 : _groupBucket$dateAgg.buckets) || [];
    const groupResult = {
      group: groupName,
      metrics: []
    };
    result.results.push(groupResult);

    for (const dateBucket of dateBuckets) {
      const date = dateBucket.to_as_string;
      const value = isCountAgg ? dateBucket.doc_count : dateBucket.metricAgg.value;
      groupResult.metrics.push([date, value]);
    }
  }

  return result;
}