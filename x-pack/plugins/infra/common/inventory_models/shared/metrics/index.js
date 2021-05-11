"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _nginx_request_rate = require("./tsvb/nginx_request_rate");

var _nginx_active_connections = require("./tsvb/nginx_active_connections");

var _nginx_hits = require("./tsvb/nginx_hits");

var _nginx_requests_per_connection = require("./tsvb/nginx_requests_per_connection");

var _aws_cpu_utilization = require("./tsvb/aws_cpu_utilization");

var _aws_diskio_bytes = require("./tsvb/aws_diskio_bytes");

var _aws_diskio_ops = require("./tsvb/aws_diskio_ops");

var _aws_network_bytes = require("./tsvb/aws_network_bytes");

var _aws_network_packets = require("./tsvb/aws_network_packets");

var _aws_overview = require("./tsvb/aws_overview");

var _count = require("./snapshot/count");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: {
    nginxActiveConnections: _nginx_active_connections.nginxActiveConnections,
    nginxHits: _nginx_hits.nginxHits,
    nginxRequestRate: _nginx_request_rate.nginxRequestRate,
    nginxRequestsPerConnection: _nginx_requests_per_connection.nginxRequestsPerConnection,
    awsCpuUtilization: _aws_cpu_utilization.awsCpuUtilization,
    awsDiskioBytes: _aws_diskio_bytes.awsDiskioBytes,
    awsDiskioOps: _aws_diskio_ops.awsDiskioOps,
    awsNetworkBytes: _aws_network_bytes.awsNetworkBytes,
    awsNetworkPackets: _aws_network_packets.awsNetworkPackets,
    awsOverview: _aws_overview.awsOverview
  },
  snapshot: {
    count: _count.count
  },
  defaultSnapshot: 'count',
  defaultTimeRangeInSeconds: 3600
};
exports.metrics = metrics;