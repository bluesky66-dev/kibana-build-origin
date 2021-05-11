"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateCondition = void 0;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _metrics = require("../../../../common/alerting/metrics");

var _types = require("./types");

var _utils = require("../common/utils");

var _get_nodes = require("../../../routes/snapshot/lib/get_nodes");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const evaluateCondition = async (condition, nodeType, source, callCluster, filterQuery, lookbackSize) => {
  var _warningThreshold;

  const {
    comparator,
    warningComparator,
    metric,
    customMetric
  } = condition;
  let {
    threshold,
    warningThreshold
  } = condition;
  const timerange = {
    to: Date.now(),
    from: (0, _moment.default)().subtract(condition.timeSize, condition.timeUnit).toDate().getTime(),
    interval: condition.timeUnit
  };

  if (lookbackSize) {
    timerange.lookbackSize = lookbackSize;
  }

  const currentValues = await getData(callCluster, nodeType, metric, timerange, source, filterQuery, customMetric);
  threshold = threshold.map(n => convertMetricValue(metric, n));
  warningThreshold = (_warningThreshold = warningThreshold) === null || _warningThreshold === void 0 ? void 0 : _warningThreshold.map(n => convertMetricValue(metric, n));

  const valueEvaluator = (value, t, c) => {
    if (value === undefined || value === null || !t || !c) return [false];
    const comparisonFunction = comparatorMap[c];
    return Array.isArray(value) ? value.map(v => comparisonFunction(Number(v), t)) : [comparisonFunction(value, t)];
  };

  const result = (0, _lodash.mapValues)(currentValues, value => {
    if ((0, _metrics.isTooManyBucketsPreviewException)(value)) throw value;
    return { ...condition,
      shouldFire: valueEvaluator(value, threshold, comparator),
      shouldWarn: valueEvaluator(value, warningThreshold, warningComparator),
      isNoData: Array.isArray(value) ? value.map(v => v === null) : [value === null],
      isError: value === undefined,
      currentValue: getCurrentValue(value)
    };
  }); // Typescript doesn't seem to know what `throw` is doing

  return result;
};

exports.evaluateCondition = evaluateCondition;

const getCurrentValue = value => {
  if (Array.isArray(value)) return getCurrentValue((0, _lodash.last)(value));
  if (value !== null) return Number(value);
  return NaN;
};

const getData = async (callCluster, nodeType, metric, timerange, source, filterQuery, customMetric) => {
  const client = options => callCluster('search', options);

  const metrics = [metric === 'custom' ? customMetric : {
    type: metric
  }];
  const snapshotRequest = {
    filterQuery,
    nodeType,
    groupBy: [],
    sourceId: 'default',
    metrics,
    timerange,
    includeTimeseries: Boolean(timerange.lookbackSize)
  };

  try {
    const {
      nodes
    } = await (0, _get_nodes.getNodes)(client, snapshotRequest, source);
    if (!nodes.length) return {
      [_utils.UNGROUPED_FACTORY_KEY]: null
    }; // No Data state

    return nodes.reduce((acc, n) => {
      const {
        name: nodeName
      } = n;
      const m = (0, _lodash.first)(n.metrics);

      if (m && m.value && m.timeseries) {
        const {
          timeseries
        } = m;
        const values = timeseries.rows.map(row => row.metric_0);
        acc[nodeName] = values;
      } else {
        acc[nodeName] = m && m.value;
      }

      return acc;
    }, {});
  } catch (e) {
    if (timerange.lookbackSize) {
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
      [_utils.UNGROUPED_FACTORY_KEY]: undefined
    };
  }
};

const comparatorMap = {
  [_types.Comparator.BETWEEN]: (value, [a, b]) => value >= Math.min(a, b) && value <= Math.max(a, b),
  // `threshold` is always an array of numbers in case the BETWEEN comparator is
  // used; all other compartors will just destructure the first value in the array
  [_types.Comparator.GT]: (a, [b]) => a > b,
  [_types.Comparator.LT]: (a, [b]) => a < b,
  [_types.Comparator.OUTSIDE_RANGE]: (value, [a, b]) => value < a || value > b,
  [_types.Comparator.GT_OR_EQ]: (a, [b]) => a >= b,
  [_types.Comparator.LT_OR_EQ]: (a, [b]) => a <= b
}; // Some metrics in the UI are in a different unit that what we store in ES.

const convertMetricValue = (metric, value) => {
  if (converters[metric]) {
    return converters[metric](value);
  } else {
    return value;
  }
};

const converters = {
  cpu: n => Number(n) / 100,
  memory: n => Number(n) / 100
};