"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _cpu = require("./snapshot/cpu");

var _rds_latency = require("./snapshot/rds_latency");

var _rds_connections = require("./snapshot/rds_connections");

var _rds_queries_executed = require("./snapshot/rds_queries_executed");

var _rds_active_transactions = require("./snapshot/rds_active_transactions");

var _aws_rds_latency = require("./tsvb/aws_rds_latency");

var _aws_rds_connections = require("./tsvb/aws_rds_connections");

var _aws_rds_cpu_total = require("./tsvb/aws_rds_cpu_total");

var _aws_rds_queries_executed = require("./tsvb/aws_rds_queries_executed");

var _aws_rds_active_transactions = require("./tsvb/aws_rds_active_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: {
    awsRDSLatency: _aws_rds_latency.awsRDSLatency,
    awsRDSConnections: _aws_rds_connections.awsRDSConnections,
    awsRDSCpuTotal: _aws_rds_cpu_total.awsRDSCpuTotal,
    awsRDSQueriesExecuted: _aws_rds_queries_executed.awsRDSQueriesExecuted,
    awsRDSActiveTransactions: _aws_rds_active_transactions.awsRDSActiveTransactions
  },
  snapshot: {
    cpu: _cpu.cpu,
    rdsLatency: _rds_latency.rdsLatency,
    rdsConnections: _rds_connections.rdsConnections,
    rdsQueriesExecuted: _rds_queries_executed.rdsQueriesExecuted,
    rdsActiveTransactions: _rds_active_transactions.rdsActiveTransactions
  },
  defaultSnapshot: 'cpu',
  defaultTimeRangeInSeconds: 14400 // 4 hours

};
exports.metrics = metrics;