"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _cpu = require("./snapshot/cpu");

var _rx = require("./snapshot/rx");

var _tx = require("./snapshot/tx");

var _disk_io_read_bytes = require("./snapshot/disk_io_read_bytes");

var _disk_io_write_bytes = require("./snapshot/disk_io_write_bytes");

var _aws_ec2_cpu_utilization = require("./tsvb/aws_ec2_cpu_utilization");

var _aws_ec2_network_traffic = require("./tsvb/aws_ec2_network_traffic");

var _aws_ec2_diskio_bytes = require("./tsvb/aws_ec2_diskio_bytes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: {
    awsEC2CpuUtilization: _aws_ec2_cpu_utilization.awsEC2CpuUtilization,
    awsEC2NetworkTraffic: _aws_ec2_network_traffic.awsEC2NetworkTraffic,
    awsEC2DiskIOBytes: _aws_ec2_diskio_bytes.awsEC2DiskIOBytes
  },
  snapshot: {
    cpu: _cpu.cpu,
    rx: _rx.rx,
    tx: _tx.tx,
    diskIOReadBytes: _disk_io_read_bytes.diskIOReadBytes,
    diskIOWriteBytes: _disk_io_write_bytes.diskIOWriteBytes
  },
  defaultSnapshot: 'cpu',
  defaultTimeRangeInSeconds: 14400 // 4 hours

};
exports.metrics = metrics;