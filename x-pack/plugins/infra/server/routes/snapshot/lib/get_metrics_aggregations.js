"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsAggregations = exports.metricToAggregation = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("../../../../common/inventory_models/types");

var _http_api = require("../../../../common/http_api");

var _inventory_models = require("../../../../common/inventory_models");

var _network_traffic = require("../../../../common/inventory_models/shared/metrics/snapshot/network_traffic");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metricToAggregation = (nodeType, metric, index) => {
  var _inventoryModel$metri;

  const inventoryModel = (0, _inventory_models.findInventoryModel)(nodeType);

  if (_http_api.SnapshotCustomMetricInputRT.is(metric)) {
    if (metric.aggregation === 'rate') {
      return (0, _network_traffic.networkTraffic)(`custom_${index}`, metric.field);
    }

    return {
      [`custom_${index}`]: {
        [metric.aggregation]: {
          field: metric.field
        }
      }
    };
  }

  return (_inventoryModel$metri = inventoryModel.metrics.snapshot) === null || _inventoryModel$metri === void 0 ? void 0 : _inventoryModel$metri[metric.type];
};

exports.metricToAggregation = metricToAggregation;

const getMetricsAggregations = options => {
  const {
    metrics
  } = options;
  return metrics.reduce((aggs, metric, index) => {
    const aggregation = metricToAggregation(options.nodeType, metric, index);

    if (!_types.MetricsUIAggregationRT.is(aggregation)) {
      throw new Error(_i18n.i18n.translate('xpack.infra.snapshot.missingSnapshotMetricError', {
        defaultMessage: 'The aggregation for {metric} for {nodeType} is not available.',
        values: {
          nodeType: options.nodeType,
          metric: metric.type
        }
      }));
    }

    return { ...aggs,
      ...aggregation
    };
  }, {});
};

exports.getMetricsAggregations = getMetricsAggregations;