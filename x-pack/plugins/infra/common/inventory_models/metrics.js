"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _metrics = require("./host/metrics");

var _metrics2 = require("./shared/metrics");

var _metrics3 = require("./pod/metrics");

var _metrics4 = require("./container/metrics");

var _metrics5 = require("./aws_ec2/metrics");

var _metrics6 = require("./aws_s3/metrics");

var _metrics7 = require("./aws_rds/metrics");

var _metrics8 = require("./aws_sqs/metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: { ..._metrics.metrics.tsvb,
    ..._metrics2.metrics.tsvb,
    ..._metrics3.metrics.tsvb,
    ..._metrics4.metrics.tsvb,
    ..._metrics5.metrics.tsvb,
    ..._metrics6.metrics.tsvb,
    ..._metrics7.metrics.tsvb,
    ..._metrics8.metrics.tsvb
  }
};
exports.metrics = metrics;