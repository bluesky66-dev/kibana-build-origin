"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsChartDataByAgent = getMetricsChartDataByAgent;

var _java = require("./by_agent/java");

var _default = require("./by_agent/default");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getMetricsChartDataByAgent({
  environment,
  setup,
  serviceName,
  serviceNodeName,
  agentName
}) {
  switch (agentName) {
    case 'java':
      {
        return (0, _java.getJavaMetricsCharts)({
          environment,
          setup,
          serviceName,
          serviceNodeName
        });
      }

    default:
      {
        return (0, _default.getDefaultMetricsCharts)({
          environment,
          setup,
          serviceName
        });
      }
  }
}