"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeRangeWithInterval = void 0;

var _lodash = require("lodash");

var _calculate_metric_interval = require("../../../utils/calculate_metric_interval");

var _get_metrics_aggregations = require("./get_metrics_aggregations");

var _types = require("../../../../common/inventory_models/types");

var _get_dataset_for_field = require("../../metrics_explorer/lib/get_dataset_for_field");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createInterval = async (client, options) => {
  const {
    timerange
  } = options;
  const aggregations = (0, _get_metrics_aggregations.getMetricsAggregations)(options);
  const modules = await aggregationsToModules(client, aggregations, options);
  return Math.max((await (0, _calculate_metric_interval.calculateMetricInterval)(client, {
    indexPattern: options.sourceConfiguration.metricAlias,
    timestampField: options.sourceConfiguration.fields.timestamp,
    timerange: {
      from: timerange.from,
      to: timerange.to
    }
  }, modules, options.nodeType)) || 60, 60);
};

const createTimeRangeWithInterval = async (client, options) => {
  const {
    timerange
  } = options;

  if (timerange.forceInterval) {
    return {
      interval: timerange.interval,
      from: timerange.from,
      to: timerange.to
    };
  }

  if (timerange.ignoreLookback) {
    return {
      interval: 'modules',
      from: timerange.from,
      to: timerange.to
    };
  }

  const calculatedInterval = await createInterval(client, options);
  const lookbackSize = Math.max(timerange.lookbackSize || 5, 5);
  return {
    interval: `${calculatedInterval}s`,
    from: timerange.to - calculatedInterval * lookbackSize * 1000,
    // We need at least 5 buckets worth of data
    to: timerange.to
  };
};

exports.createTimeRangeWithInterval = createTimeRangeWithInterval;

const aggregationsToModules = async (client, aggregations, options) => {
  const uniqueFields = Object.values(aggregations).reduce((fields, agg) => {
    if (_types.ESBasicMetricAggRT.is(agg)) {
      return (0, _lodash.uniq)(fields.concat(Object.values(agg).map(a => a === null || a === void 0 ? void 0 : a.field)));
    }

    return fields;
  }, []).filter(v => v);
  const fields = await Promise.all(uniqueFields.map(async field => await (0, _get_dataset_for_field.getDatasetForField)(client, field, options.sourceConfiguration.metricAlias, { ...options.timerange,
    field: options.sourceConfiguration.fields.timestamp
  })));
  return fields.filter(f => f);
};