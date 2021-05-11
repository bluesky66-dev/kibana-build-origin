"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerCpuKernel = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const containerCpuKernel = (timeField, indexPattern, interval) => ({
  id: 'containerCpuKernel',
  requires: ['docker.cpu'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'kernel',
    split_mode: 'everything',
    metrics: [{
      field: 'docker.cpu.kernel.pct',
      id: 'avg-cpu-kernel',
      type: 'avg'
    }]
  }]
});

exports.containerCpuKernel = containerCpuKernel;