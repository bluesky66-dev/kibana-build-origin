"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostDockerTop5ByMemory = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hostDockerTop5ByMemory = (timeField, indexPattern, interval) => ({
  id: 'hostDockerTop5ByMemory',
  requires: ['docker.memory'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'avg-memory',
    metrics: [{
      field: 'docker.memory.usage.pct',
      id: 'avg-memory-metric',
      type: 'avg'
    }],
    split_mode: 'terms',
    terms_field: 'container.name',
    terms_order_by: 'avg-memory',
    terms_size: 5
  }]
});

exports.hostDockerTop5ByMemory = hostDockerTop5ByMemory;