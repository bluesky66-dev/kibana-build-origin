"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _cpu = require("./snapshot/cpu");

var _memory = require("./snapshot/memory");

var _rx = require("./snapshot/rx");

var _tx = require("./snapshot/tx");

var _pod_overview = require("./tsvb/pod_overview");

var _pod_cpu_usage = require("./tsvb/pod_cpu_usage");

var _pod_log_usage = require("./tsvb/pod_log_usage");

var _pod_memory_usage = require("./tsvb/pod_memory_usage");

var _pod_network_traffic = require("./tsvb/pod_network_traffic");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: {
    podOverview: _pod_overview.podOverview,
    podCpuUsage: _pod_cpu_usage.podCpuUsage,
    podLogUsage: _pod_log_usage.podLogUsage,
    podNetworkTraffic: _pod_network_traffic.podNetworkTraffic,
    podMemoryUsage: _pod_memory_usage.podMemoryUsage
  },
  snapshot: {
    cpu: _cpu.cpu,
    memory: _memory.memory,
    rx: _rx.rx,
    tx: _tx.tx
  },
  defaultSnapshot: 'cpu',
  defaultTimeRangeInSeconds: 3600 // 1 hour

};
exports.metrics = metrics;