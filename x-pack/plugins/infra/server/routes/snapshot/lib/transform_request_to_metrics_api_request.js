"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformRequestToMetricsAPIRequest = void 0;

var _inventory_models = require("../../../../common/inventory_models");

var _create_timerange_with_interval = require("./create_timerange_with_interval");

var _serialized_query = require("../../../utils/serialized_query");

var _transform_snapshot_metrics_to_metrics_api_metrics = require("./transform_snapshot_metrics_to_metrics_api_metrics");

var _calculate_index_pattern_based_on_metrics = require("./calculate_index_pattern_based_on_metrics");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const transformRequestToMetricsAPIRequest = async (client, source, snapshotRequest) => {
  const timeRangeWithIntervalApplied = await (0, _create_timerange_with_interval.createTimeRangeWithInterval)(client, { ...snapshotRequest,
    filterQuery: (0, _serialized_query.parseFilterQuery)(snapshotRequest.filterQuery),
    sourceConfiguration: source.configuration
  });
  const metricsApiRequest = {
    indexPattern: (0, _calculate_index_pattern_based_on_metrics.calculateIndexPatterBasedOnMetrics)(snapshotRequest, source),
    timerange: {
      field: source.configuration.fields.timestamp,
      from: timeRangeWithIntervalApplied.from,
      to: timeRangeWithIntervalApplied.to,
      interval: timeRangeWithIntervalApplied.interval
    },
    metrics: (0, _transform_snapshot_metrics_to_metrics_api_metrics.transformSnapshotMetricsToMetricsAPIMetrics)(snapshotRequest),
    limit: snapshotRequest.overrideCompositeSize ? snapshotRequest.overrideCompositeSize : 5,
    alignDataToEnd: true
  };
  const filters = [];
  const parsedFilters = (0, _serialized_query.parseFilterQuery)(snapshotRequest.filterQuery);

  if (parsedFilters) {
    filters.push(parsedFilters);
  }

  if (snapshotRequest.accountId) {
    filters.push({
      term: {
        'cloud.account.id': snapshotRequest.accountId
      }
    });
  }

  if (snapshotRequest.region) {
    filters.push({
      term: {
        'cloud.region': snapshotRequest.region
      }
    });
  }

  const inventoryModel = (0, _inventory_models.findInventoryModel)(snapshotRequest.nodeType);

  if (inventoryModel && inventoryModel.nodeFilter) {
    var _inventoryModel$nodeF;

    (_inventoryModel$nodeF = inventoryModel.nodeFilter) === null || _inventoryModel$nodeF === void 0 ? void 0 : _inventoryModel$nodeF.forEach(f => filters.push(f));
  }

  const inventoryFields = (0, _inventory_models.findInventoryFields)(snapshotRequest.nodeType, source.configuration.fields);

  if (snapshotRequest.groupBy) {
    const groupBy = snapshotRequest.groupBy.map(g => g.field).filter(Boolean);
    metricsApiRequest.groupBy = [...groupBy, inventoryFields.id];
  }

  const metaAggregation = {
    id: _constants.META_KEY,
    aggregations: {
      [_constants.META_KEY]: {
        top_hits: {
          size: 1,
          _source: [inventoryFields.name],
          sort: [{
            [source.configuration.fields.timestamp]: 'desc'
          }]
        }
      }
    }
  };

  if (inventoryFields.ip) {
    metaAggregation.aggregations[_constants.META_KEY].top_hits._source.push(inventoryFields.ip);
  }

  metricsApiRequest.metrics.push(metaAggregation);

  if (filters.length) {
    metricsApiRequest.filters = filters;
  }

  return metricsApiRequest;
};

exports.transformRequestToMetricsAPIRequest = transformRequestToMetricsAPIRequest;