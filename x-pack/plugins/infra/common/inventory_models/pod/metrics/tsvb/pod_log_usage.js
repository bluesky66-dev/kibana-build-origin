"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.podLogUsage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const podLogUsage = (timeField, indexPattern, interval) => ({
  id: 'podLogUsage',
  requires: ['kubernetes.pod'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'logs',
    split_mode: 'everything',
    metrics: [{
      field: 'kubernetes.container.logs.used.bytes',
      id: 'avg-log-used',
      type: 'avg'
    }, {
      field: 'kubernetes.container.logs.capacity.bytes',
      id: 'max-log-cap',
      type: 'max'
    }, {
      id: 'calc-usage-limit',
      script: 'params.usage / params.limit',
      type: 'calculation',
      variables: [{
        field: 'avg-log-userd',
        id: 'var-usage',
        name: 'usage'
      }, {
        field: 'max-log-cap',
        id: 'var-limit',
        name: 'limit'
      }]
    }]
  }]
});

exports.podLogUsage = podLogUsage;