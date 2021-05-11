"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformSnapshotMetricsToMetricsAPIMetrics = void 0;

var _network_traffic = require("../../../../common/inventory_models/shared/metrics/snapshot/network_traffic");

var _inventory_models = require("../../../../common/inventory_models");

var _http_api = require("../../../../common/http_api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformSnapshotMetricsToMetricsAPIMetrics = snapshotRequest => {
  return snapshotRequest.metrics.map((metric, index) => {
    var _inventoryModel$metri;

    const inventoryModel = (0, _inventory_models.findInventoryModel)(snapshotRequest.nodeType);

    if (_http_api.SnapshotCustomMetricInputRT.is(metric)) {
      const isUniqueId = snapshotRequest.metrics.findIndex(m => _http_api.SnapshotCustomMetricInputRT.is(m) ? m.id === metric.id : false);
      const customId = isUniqueId ? metric.id : `custom_${index}`;

      if (metric.aggregation === 'rate') {
        return {
          id: customId,
          aggregations: (0, _network_traffic.networkTraffic)(customId, metric.field)
        };
      }

      return {
        id: customId,
        aggregations: {
          [customId]: {
            [metric.aggregation]: {
              field: metric.field
            }
          }
        }
      };
    }

    return {
      id: metric.type,
      aggregations: (_inventoryModel$metri = inventoryModel.metrics.snapshot) === null || _inventoryModel$metri === void 0 ? void 0 : _inventoryModel$metri[metric.type]
    };
  });
};

exports.transformSnapshotMetricsToMetricsAPIMetrics = transformSnapshotMetricsToMetricsAPIMetrics;