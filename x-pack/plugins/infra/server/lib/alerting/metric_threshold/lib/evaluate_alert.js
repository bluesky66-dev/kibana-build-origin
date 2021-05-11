"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateAlert = void 0;

var _lodash = require("lodash");

var _metrics = require("../../../../../common/alerting/metrics");

var _create_afterkey_handler = require("../../../../utils/create_afterkey_handler");

var _get_all_composite_data = require("../../../../utils/get_all_composite_data");

var _messages = require("../../common/messages");

var _utils = require("../../common/utils");

var _types = require("../types");

var _metric_query = require("./metric_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const evaluateAlert = (callCluster, params, config, timeframe) => {
  const {
    criteria,
    groupBy,
    filterQuery
  } = params;
  return Promise.all(criteria.map(async criterion => {
    const currentValues = await getMetric(callCluster, criterion, config.metricAlias, config.fields.timestamp, groupBy, filterQuery, timeframe);
    const {
      threshold,
      warningThreshold,
      comparator,
      warningComparator
    } = criterion;

    const pointsEvaluator = (points, t, c) => {
      if (!t || !c) return [false];
      const comparisonFunction = comparatorMap[c];
      return Array.isArray(points) ? points.map(point => t && typeof point.value === 'number' && comparisonFunction(point.value, t)) : [false];
    };

    return (0, _lodash.mapValues)(currentValues, points => {
      var _criterion$metric, _last, _last2, _last3;

      if ((0, _metrics.isTooManyBucketsPreviewException)(points)) throw points;
      return { ...criterion,
        metric: (_criterion$metric = criterion.metric) !== null && _criterion$metric !== void 0 ? _criterion$metric : _messages.DOCUMENT_COUNT_I18N,
        currentValue: Array.isArray(points) ? (_last = (0, _lodash.last)(points)) === null || _last === void 0 ? void 0 : _last.value : NaN,
        timestamp: Array.isArray(points) ? (_last2 = (0, _lodash.last)(points)) === null || _last2 === void 0 ? void 0 : _last2.key : NaN,
        shouldFire: pointsEvaluator(points, threshold, comparator),
        shouldWarn: pointsEvaluator(points, warningThreshold, warningComparator),
        isNoData: Array.isArray(points) ? points.map(point => (point === null || point === void 0 ? void 0 : point.value) === null || point === null) : [points === null],
        isError: (0, _lodash.isNaN)(Array.isArray(points) ? (_last3 = (0, _lodash.last)(points)) === null || _last3 === void 0 ? void 0 : _last3.value : points)
      };
    });
  }));
};

exports.evaluateAlert = evaluateAlert;

const getMetric = async function (callCluster, params, index, timefield, groupBy, filterQuery, timeframe) {
  const {
    aggType
  } = params;
  const hasGroupBy = groupBy && groupBy.length;
  const searchBody = (0, _metric_query.getElasticsearchMetricQuery)(params, timefield, hasGroupBy ? groupBy : undefined, filterQuery, timeframe);

  try {
    if (hasGroupBy) {
      const bucketSelector = response => {
        var _response$aggregation, _response$aggregation2;

        return ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.groupings) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.buckets) || [];
      };

      const afterKeyHandler = (0, _create_afterkey_handler.createAfterKeyHandler)('aggs.groupings.composite.after', response => {
        var _response$aggregation3, _response$aggregation4;

        return (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.groupings) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.after_key;
      });
      const compositeBuckets = await (0, _get_all_composite_data.getAllCompositeData)(body => callCluster('search', {
        body,
        index
      }), searchBody, bucketSelector, afterKeyHandler);
      return compositeBuckets.reduce((result, bucket) => ({ ...result,
        [Object.values(bucket.key).map(value => value).join(', ')]: getValuesFromAggregations(bucket, aggType)
      }), {});
    }

    const result = await callCluster('search', {
      body: searchBody,
      index
    });
    return {
      [_utils.UNGROUPED_FACTORY_KEY]: getValuesFromAggregations(result.aggregations, aggType)
    };
  } catch (e) {
    if (timeframe) {
      var _e$body, _e$body$error, _e$body$error$caused_; // This code should only ever be reached when previewing the alert, not executing it


      const causedByType = (_e$body = e.body) === null || _e$body === void 0 ? void 0 : (_e$body$error = _e$body.error) === null || _e$body$error === void 0 ? void 0 : (_e$body$error$caused_ = _e$body$error.caused_by) === null || _e$body$error$caused_ === void 0 ? void 0 : _e$body$error$caused_.type;

      if (causedByType === 'too_many_buckets_exception') {
        return {
          [_utils.UNGROUPED_FACTORY_KEY]: {
            [_metrics.TOO_MANY_BUCKETS_PREVIEW_EXCEPTION]: true,
            maxBuckets: e.body.error.caused_by.max_buckets
          }
        };
      }
    }

    return {
      [_utils.UNGROUPED_FACTORY_KEY]: NaN
    }; // Trigger an Error state
  }
};

const getValuesFromAggregations = (aggregations, aggType) => {
  try {
    const {
      buckets
    } = aggregations.aggregatedIntervals;
    if (!buckets.length) return null; // No Data state

    if (aggType === _types.Aggregators.COUNT) {
      return buckets.map(bucket => ({
        key: bucket.key_as_string,
        value: bucket.doc_count
      }));
    }

    if (aggType === _types.Aggregators.P95 || aggType === _types.Aggregators.P99) {
      return buckets.map(bucket => {
        var _bucket$aggregatedVal;

        const values = ((_bucket$aggregatedVal = bucket.aggregatedValue) === null || _bucket$aggregatedVal === void 0 ? void 0 : _bucket$aggregatedVal.values) || [];
        const firstValue = (0, _lodash.first)(values);
        if (!firstValue) return null;
        return {
          key: bucket.key_as_string,
          value: firstValue.value
        };
      });
    }

    return buckets.map(bucket => {
      var _bucket$aggregatedVal2, _bucket$aggregatedVal3;

      return {
        key: bucket.key_as_string,
        value: (_bucket$aggregatedVal2 = (_bucket$aggregatedVal3 = bucket.aggregatedValue) === null || _bucket$aggregatedVal3 === void 0 ? void 0 : _bucket$aggregatedVal3.value) !== null && _bucket$aggregatedVal2 !== void 0 ? _bucket$aggregatedVal2 : null
      };
    });
  } catch (e) {
    return NaN; // Error state
  }
};

const comparatorMap = {
  [_types.Comparator.BETWEEN]: (value, [a, b]) => value >= Math.min(a, b) && value <= Math.max(a, b),
  [_types.Comparator.OUTSIDE_RANGE]: (value, [a, b]) => value < a || value > b,
  // `threshold` is always an array of numbers in case the BETWEEN/OUTSIDE_RANGE comparator is
  // used; all other compartors will just destructure the first value in the array
  [_types.Comparator.GT]: (a, [b]) => a > b,
  [_types.Comparator.LT]: (a, [b]) => a < b,
  [_types.Comparator.GT_OR_EQ]: (a, [b]) => a >= b,
  [_types.Comparator.LT_OR_EQ]: (a, [b]) => a <= b
};