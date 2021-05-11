"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElasticsearchMetricQuery = void 0;

var _network_traffic = require("../../../../../common/inventory_models/shared/metrics/snapshot/network_traffic");

var _types = require("../types");

var _get_interval_in_seconds = require("../../../../utils/get_interval_in_seconds");

var _round_timestamp = require("../../../../utils/round_timestamp");

var _create_percentile_aggregation = require("./create_percentile_aggregation");

var _calculate_date_histogram_offset = require("../../../metrics/lib/calculate_date_histogram_offset");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MINIMUM_BUCKETS = 5;

const getParsedFilterQuery = filterQuery => {
  if (!filterQuery) return null;
  return JSON.parse(filterQuery);
};

const getElasticsearchMetricQuery = ({
  metric,
  aggType,
  timeUnit,
  timeSize
}, timefield, groupBy, filterQuery, timeframe) => {
  if (aggType === _types.Aggregators.COUNT && metric) {
    throw new Error('Cannot aggregate document count with a metric');
  }

  if (aggType !== _types.Aggregators.COUNT && !metric) {
    throw new Error('Can only aggregate without a metric if using the document count aggregator');
  }

  const interval = `${timeSize}${timeUnit}`;
  const intervalAsSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(interval);
  const to = (0, _round_timestamp.roundTimestamp)(timeframe ? timeframe.end : Date.now(), timeUnit); // We need enough data for 5 buckets worth of data. We also need
  // to convert the intervalAsSeconds to milliseconds.

  const minimumFrom = to - intervalAsSeconds * 1000 * MINIMUM_BUCKETS;
  const from = (0, _round_timestamp.roundTimestamp)(timeframe && timeframe.start <= minimumFrom ? timeframe.start : minimumFrom, timeUnit);
  const offset = (0, _calculate_date_histogram_offset.calculateDateHistogramOffset)({
    from,
    to,
    interval,
    field: timefield
  });
  const aggregations = aggType === _types.Aggregators.COUNT ? {} : aggType === _types.Aggregators.RATE ? (0, _network_traffic.networkTraffic)('aggregatedValue', metric) : aggType === _types.Aggregators.P95 || aggType === _types.Aggregators.P99 ? (0, _create_percentile_aggregation.createPercentileAggregation)(aggType, metric) : {
    aggregatedValue: {
      [aggType]: {
        field: metric
      }
    }
  };
  const baseAggs = {
    aggregatedIntervals: {
      date_histogram: {
        field: timefield,
        fixed_interval: interval,
        offset,
        extended_bounds: {
          min: from,
          max: to
        }
      },
      aggregations
    }
  };
  const aggs = groupBy ? {
    groupings: {
      composite: {
        size: 10,
        sources: Array.isArray(groupBy) ? groupBy.map((field, index) => ({
          [`groupBy${index}`]: {
            terms: {
              field
            }
          }
        })) : [{
          groupBy0: {
            terms: {
              field: groupBy
            }
          }
        }]
      },
      aggs: baseAggs
    }
  } : baseAggs;
  const rangeFilters = [{
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'epoch_millis'
      }
    }
  }];
  const metricFieldFilters = metric ? [{
    exists: {
      field: metric
    }
  }] : [];
  const parsedFilterQuery = getParsedFilterQuery(filterQuery);
  return {
    query: {
      bool: {
        filter: [...rangeFilters, ...metricFieldFilters, ...(parsedFilterQuery ? [parsedFilterQuery] : [])]
      }
    },
    size: 0,
    aggs
  };
};

exports.getElasticsearchMetricQuery = getElasticsearchMetricQuery;