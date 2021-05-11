"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostDockerTop5ByCpu = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hostDockerTop5ByCpu = (timeField, indexPattern, interval) => ({
  id: 'hostDockerTop5ByCpu',
  requires: ['docker.cpu'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'avg-cpu',
    metrics: [{
      field: 'docker.cpu.total.pct',
      id: 'avg-cpu-metric',
      type: 'avg'
    }],
    split_mode: 'terms',
    terms_field: 'container.name',
    terms_order_by: 'avg-cpu',
    terms_size: 5
  }]
});

exports.hostDockerTop5ByCpu = hostDockerTop5ByCpu;