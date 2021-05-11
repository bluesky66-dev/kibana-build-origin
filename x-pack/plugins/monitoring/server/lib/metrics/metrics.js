"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _metrics = require("./elasticsearch/metrics");

var _metrics2 = require("./kibana/metrics");

var _metrics3 = require("./logstash/metrics");

var _metrics4 = require("./beats/metrics");

var _metrics5 = require("./apm/metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = { ..._metrics.metrics,
  ..._metrics2.metrics,
  ..._metrics3.metrics,
  ..._metrics4.metrics,
  ..._metrics5.metrics
};
exports.metrics = metrics;