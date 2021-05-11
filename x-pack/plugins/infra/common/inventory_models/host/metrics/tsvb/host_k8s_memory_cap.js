"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostK8sMemoryCap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hostK8sMemoryCap = (timeField, indexPattern, interval) => ({
  id: 'hostK8sMemoryCap',
  map_field_to: 'kubernetes.node.name',
  requires: ['kubernetes.node'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'capacity',
    metrics: [{
      field: 'kubernetes.node.memory.allocatable.bytes',
      id: 'max-memory-cap',
      type: 'max'
    }],
    split_mode: 'everything'
  }, {
    id: 'used',
    metrics: [{
      field: 'kubernetes.node.memory.usage.bytes',
      id: 'avg-memory-usage',
      type: 'avg'
    }],
    split_mode: 'everything'
  }]
});

exports.hostK8sMemoryCap = hostK8sMemoryCap;