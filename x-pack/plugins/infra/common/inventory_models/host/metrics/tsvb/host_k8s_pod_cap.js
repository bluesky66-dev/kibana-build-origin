"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostK8sPodCap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hostK8sPodCap = (timeField, indexPattern, interval) => ({
  id: 'hostK8sPodCap',
  requires: ['kubernetes.node'],
  map_field_to: 'kubernetes.node.name',
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'capacity',
    metrics: [{
      field: 'kubernetes.node.pod.allocatable.total',
      id: 'max-pod-cap',
      type: 'max'
    }],
    split_mode: 'everything'
  }, {
    id: 'used',
    metrics: [{
      field: 'kubernetes.pod.uid',
      id: 'avg-pod',
      type: 'cardinality'
    }],
    split_mode: 'everything'
  }]
});

exports.hostK8sPodCap = hostK8sPodCap;