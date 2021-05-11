"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertsMatrixHistogramConfig = void 0;

var _queryAlerts_histogram = require("./query.alerts_histogram.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const alertsMatrixHistogramConfig = {
  buildDsl: _queryAlerts_histogram.buildAlertsHistogramQuery,
  aggName: 'aggregations.alertsGroup.buckets',
  parseKey: 'alerts.buckets'
};
exports.alertsMatrixHistogramConfig = alertsMatrixHistogramConfig;