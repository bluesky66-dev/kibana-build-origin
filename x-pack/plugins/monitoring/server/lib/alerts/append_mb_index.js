"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendMetricbeatIndex = appendMetricbeatIndex;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function appendMetricbeatIndex(config, indexPattern) {
  return `${indexPattern},${config.ui.metricbeat.index}`;
}