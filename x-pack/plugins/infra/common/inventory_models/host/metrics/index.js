"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _cpu = require("./snapshot/cpu");

var _count = require("../../shared/metrics/snapshot/count");

var _load = require("./snapshot/load");

var _log_rate = require("./snapshot/log_rate");

var _memory = require("./snapshot/memory");

var _rx = require("./snapshot/rx");

var _tx = require("./snapshot/tx");

var _host_system_overview = require("./tsvb/host_system_overview");

var _host_cpu_usage = require("./tsvb/host_cpu_usage");

var _host_load = require("./tsvb/host_load");

var _host_memory_usage = require("./tsvb/host_memory_usage");

var _host_network_traffic = require("./tsvb/host_network_traffic");

var _host_filesystem = require("./tsvb/host_filesystem");

var _host_k8s_overview = require("./tsvb/host_k8s_overview");

var _host_k8s_cpu_cap = require("./tsvb/host_k8s_cpu_cap");

var _host_k8s_pod_cap = require("./tsvb/host_k8s_pod_cap");

var _host_k8s_disk_cap = require("./tsvb/host_k8s_disk_cap");

var _host_k8s_memory_cap = require("./tsvb/host_k8s_memory_cap");

var _host_docker_top_5_by_memory = require("./tsvb/host_docker_top_5_by_memory");

var _host_docker_top_5_by_cpu = require("./tsvb/host_docker_top_5_by_cpu");

var _host_docker_overview = require("./tsvb/host_docker_overview");

var _host_docker_info = require("./tsvb/host_docker_info");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: {
    hostSystemOverview: _host_system_overview.hostSystemOverview,
    hostCpuUsage: _host_cpu_usage.hostCpuUsage,
    hostLoad: _host_load.hostLoad,
    hostMemoryUsage: _host_memory_usage.hostMemoryUsage,
    hostNetworkTraffic: _host_network_traffic.hostNetworkTraffic,
    hostFilesystem: _host_filesystem.hostFilesystem,
    hostK8sOverview: _host_k8s_overview.hostK8sOverview,
    hostK8sCpuCap: _host_k8s_cpu_cap.hostK8sCpuCap,
    hostK8sPodCap: _host_k8s_pod_cap.hostK8sPodCap,
    hostK8sDiskCap: _host_k8s_disk_cap.hostK8sDiskCap,
    hostK8sMemoryCap: _host_k8s_memory_cap.hostK8sMemoryCap,
    hostDockerOverview: _host_docker_overview.hostDockerOverview,
    hostDockerInfo: _host_docker_info.hostDockerInfo,
    hostDockerTop5ByMemory: _host_docker_top_5_by_memory.hostDockerTop5ByMemory,
    hostDockerTop5ByCpu: _host_docker_top_5_by_cpu.hostDockerTop5ByCpu
  },
  snapshot: {
    count: _count.count,
    cpu: _cpu.cpu,
    load: _load.load,
    logRate: _log_rate.logRate,
    memory: _memory.memory,
    rx: _rx.rx,
    tx: _tx.tx
  },
  defaultSnapshot: 'cpu',
  defaultTimeRangeInSeconds: 3600 // 1 hour

};
exports.metrics = metrics;