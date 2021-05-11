"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformMetricsApiResponseToSnapshotResponse = void 0;

var _lodash = require("lodash");

var _constants = require("./constants");

var _apply_metadata_to_last_path = require("./apply_metadata_to_last_path");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMetricValue = row => {
  if (!(0, _lodash.isNumber)(row.metric_0)) return null;
  const value = row.metric_0;
  return isFinite(value) ? value : null;
};

const calculateMax = rows => {
  return (0, _lodash.max)(rows.map(getMetricValue)) || 0;
};

const calculateAvg = rows => {
  return (0, _lodash.sum)(rows.map(getMetricValue)) / rows.length || 0;
};

const getLastValue = rows => {
  const row = (0, _lodash.last)(rows);
  if (!row) return null;
  return getMetricValue(row);
};

const transformMetricsApiResponseToSnapshotResponse = (options, snapshotRequest, source, metricsApiResponse) => {
  const nodes = metricsApiResponse.series.map(series => {
    var _series$keys$map, _series$keys;

    const node = {
      metrics: options.metrics.filter(m => m.id !== _constants.META_KEY).map(metric => {
        const name = metric.id;
        const timeseries = {
          id: name,
          columns: [{
            name: 'timestamp',
            type: 'date'
          }, {
            name: 'metric_0',
            type: 'number'
          }],
          rows: series.rows.map(row => {
            return {
              timestamp: row.timestamp,
              metric_0: (0, _lodash.get)(row, metric.id, null)
            };
          })
        };
        const maxValue = calculateMax(timeseries.rows);
        const avg = calculateAvg(timeseries.rows);
        const value = getLastValue(timeseries.rows);
        const nodeMetric = {
          name,
          max: maxValue,
          value,
          avg
        };

        if (snapshotRequest.includeTimeseries) {
          nodeMetric.timeseries = timeseries;
        }

        return nodeMetric;
      }),
      path: (_series$keys$map = (_series$keys = series.keys) === null || _series$keys === void 0 ? void 0 : _series$keys.map(key => {
        return {
          value: key,
          label: key
        };
      })) !== null && _series$keys$map !== void 0 ? _series$keys$map : [],
      name: ''
    };
    const path = (0, _apply_metadata_to_last_path.applyMetadataToLastPath)(series, node, snapshotRequest, source);
    const lastPath = (0, _lodash.last)(path);
    const name = lastPath && lastPath.label || 'N/A';
    return { ...node,
      path,
      name
    };
  });
  return {
    nodes,
    interval: `${metricsApiResponse.info.interval}s`
  };
};

exports.transformMetricsApiResponseToSnapshotResponse = transformMetricsApiResponseToSnapshotResponse;