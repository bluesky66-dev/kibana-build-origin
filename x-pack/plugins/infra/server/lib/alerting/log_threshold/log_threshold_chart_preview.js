"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChartPreviewData = getChartPreviewData;

var _i18n = require("@kbn/i18n");

var _log_threshold_executor = require("./log_threshold_executor");

var _types = require("../../../../common/alerting/logs/log_threshold/types");

var _runtime_types = require("../../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const COMPOSITE_GROUP_SIZE = 40;

async function getChartPreviewData(requestContext, sourceConfiguration, callWithRequest, alertParams, buckets) {
  const indexPattern = sourceConfiguration.configuration.logAlias;
  const timestampField = sourceConfiguration.configuration.fields.timestamp;
  const {
    groupBy,
    timeSize,
    timeUnit
  } = alertParams;
  const isGrouped = groupBy && groupBy.length > 0 ? true : false; // Charts will use an expanded time range

  const expandedAlertParams = { ...alertParams,
    timeSize: timeSize * buckets
  };
  const {
    rangeFilter
  } = (0, _log_threshold_executor.buildFiltersFromCriteria)(expandedAlertParams, timestampField);
  const query = isGrouped ? (0, _log_threshold_executor.getGroupedESQuery)(expandedAlertParams, timestampField, indexPattern) : (0, _log_threshold_executor.getUngroupedESQuery)(expandedAlertParams, timestampField, indexPattern);

  if (!query) {
    throw new Error('ES query could not be built from the provided alert params');
  }

  const expandedQuery = addHistogramAggregationToQuery(query, rangeFilter, `${timeSize}${timeUnit}`, timestampField, isGrouped);
  const series = isGrouped ? processGroupedResults(await getGroupedResults(expandedQuery, requestContext, callWithRequest)) : processUngroupedResults(await getUngroupedResults(expandedQuery, requestContext, callWithRequest));
  return {
    series
  };
} // Expand the same query that powers the executor with a date histogram aggregation


const addHistogramAggregationToQuery = (query, rangeFilter, interval, timestampField, isGrouped) => {
  const histogramAggregation = {
    histogramBuckets: {
      date_histogram: {
        field: timestampField,
        fixed_interval: interval,
        // Utilise extended bounds to make sure we get a full set of buckets even if there are empty buckets
        // at the start and / or end of the range.
        extended_bounds: {
          min: rangeFilter.range[timestampField].gte,
          max: rangeFilter.range[timestampField].lte
        }
      }
    }
  };

  if (isGrouped) {
    query.body.aggregations.groups.aggregations.filtered_results = { ...query.body.aggregations.groups.aggregations.filtered_results,
      aggregations: histogramAggregation
    };
  } else {
    query.body = { ...query.body,
      aggregations: histogramAggregation
    };
  }

  return query;
};

const getUngroupedResults = async (query, requestContext, callWithRequest) => {
  return (0, _runtime_types.decodeOrThrow)(_types.UngroupedSearchQueryResponseRT)(await callWithRequest(requestContext, 'search', query));
};

const getGroupedResults = async (query, requestContext, callWithRequest) => {
  let compositeGroupBuckets = [];
  let lastAfterKey;

  while (true) {
    const queryWithAfterKey = { ...query
    };
    queryWithAfterKey.body.aggregations.groups.composite.after = lastAfterKey;
    const groupResponse = (0, _runtime_types.decodeOrThrow)(_types.GroupedSearchQueryResponseRT)(await callWithRequest(requestContext, 'search', queryWithAfterKey));
    compositeGroupBuckets = [...compositeGroupBuckets, ...groupResponse.aggregations.groups.buckets];
    lastAfterKey = groupResponse.aggregations.groups.after_key;

    if (groupResponse.aggregations.groups.buckets.length < COMPOSITE_GROUP_SIZE) {
      break;
    }
  }

  return compositeGroupBuckets;
};

const processGroupedResults = results => {
  return results.reduce((series, group) => {
    if (!group.filtered_results.histogramBuckets) return series;
    const groupName = Object.values(group.key).join(', ');
    const points = group.filtered_results.histogramBuckets.buckets.reduce((pointsAcc, bucket) => {
      const {
        key,
        doc_count: count
      } = bucket;
      return [...pointsAcc, {
        timestamp: key,
        value: count
      }];
    }, []);
    return [...series, {
      id: groupName,
      points
    }];
  }, []);
};

const processUngroupedResults = results => {
  var _results$aggregations;

  if (!((_results$aggregations = results.aggregations) !== null && _results$aggregations !== void 0 && _results$aggregations.histogramBuckets)) return [];
  const points = results.aggregations.histogramBuckets.buckets.reduce((pointsAcc, bucket) => {
    const {
      key,
      doc_count: count
    } = bucket;
    return [...pointsAcc, {
      timestamp: key,
      value: count
    }];
  }, []);
  return [{
    id: everythingSeriesName,
    points
  }];
};

const everythingSeriesName = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.everythingSeriesName', {
  defaultMessage: 'Log entries'
});