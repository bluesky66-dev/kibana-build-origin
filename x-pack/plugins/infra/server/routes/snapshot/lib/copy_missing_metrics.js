"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyMissingMetrics = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createMissingMetricFinder = nodes => (0, _lodash.memoize)(id => {
  const nodeWithMetrics = nodes.find(node => {
    const lastPath = (0, _lodash.last)(node.path);
    const metric = (0, _lodash.first)(node.metrics);
    return lastPath && metric && lastPath.value === id && metric.value !== null;
  });

  if (nodeWithMetrics) {
    return nodeWithMetrics.metrics;
  }
});
/**
 * This function will look for nodes with missing data and try to find a node to copy the data from.
 * This functionality exists to suppor the use case where the user requests a group by on "Service type".
 * Since that grouping naturally excludeds every metric (except the metric for the service.type), we still
 * want to display the node with a value. A good example is viewing hosts by CPU Usage and grouping by service
 * Without this every service but `system` would be null.
 */


const copyMissingMetrics = response => {
  const {
    nodes
  } = response;
  const find = createMissingMetricFinder(nodes);
  const newNodes = nodes.map(node => {
    var _metric$timeseries$ro, _metric$timeseries;

    const lastPath = (0, _lodash.last)(node.path);
    const metric = (0, _lodash.first)(node.metrics);
    const allRowsNull = (_metric$timeseries$ro = metric === null || metric === void 0 ? void 0 : (_metric$timeseries = metric.timeseries) === null || _metric$timeseries === void 0 ? void 0 : _metric$timeseries.rows.every(r => r.metric_0 == null)) !== null && _metric$timeseries$ro !== void 0 ? _metric$timeseries$ro : true;

    if (lastPath && metric && metric.value === null && allRowsNull) {
      const newMetrics = find(lastPath.value);

      if (newMetrics) {
        return { ...node,
          metrics: newMetrics
        };
      }
    }

    return node;
  });
  return { ...response,
    nodes: newNodes
  };
};

exports.copyMissingMetrics = copyMissingMetrics;