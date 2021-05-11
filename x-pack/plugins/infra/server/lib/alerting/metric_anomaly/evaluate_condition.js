"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateCondition = void 0;

var _infra_ml = require("../../infra_ml");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const evaluateCondition = async ({
  nodeType,
  spaceId,
  sourceId,
  mlSystem,
  mlAnomalyDetectors,
  startTime,
  endTime,
  metric,
  threshold,
  influencerFilter
}) => {
  const getAnomalies = nodeType === 'k8s' ? _infra_ml.getMetricK8sAnomalies : _infra_ml.getMetricsHostsAnomalies;
  const result = await getAnomalies({
    spaceId,
    mlSystem,
    mlAnomalyDetectors
  }, sourceId !== null && sourceId !== void 0 ? sourceId : 'default', threshold, startTime, endTime, metric, {
    field: 'anomalyScore',
    direction: 'desc'
  }, {
    pageSize: 100
  }, influencerFilter);
  return result;
};

exports.evaluateCondition = evaluateCondition;