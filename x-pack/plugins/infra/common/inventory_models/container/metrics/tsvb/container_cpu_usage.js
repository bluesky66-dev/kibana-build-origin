"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerCpuUsage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const containerCpuUsage = (timeField, indexPattern, interval) => ({
  id: 'containerCpuUsage',
  requires: ['docker.cpu'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'cpu',
    split_mode: 'everything',
    metrics: [{
      field: 'docker.cpu.total.pct',
      id: 'avg-cpu-total',
      type: 'avg'
    }]
  }]
});

exports.containerCpuUsage = containerCpuUsage;