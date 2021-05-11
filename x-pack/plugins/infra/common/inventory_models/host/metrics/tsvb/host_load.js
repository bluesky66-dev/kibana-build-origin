"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostLoad = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hostLoad = (timeField, indexPattern, interval) => ({
  id: 'hostLoad',
  requires: ['system.cpu'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'load_1m',
    metrics: [{
      field: 'system.load.1',
      id: 'avg-load-1m',
      type: 'avg'
    }],
    split_mode: 'everything'
  }, {
    id: 'load_5m',
    metrics: [{
      field: 'system.load.5',
      id: 'avg-load-5m',
      type: 'avg'
    }],
    split_mode: 'everything'
  }, {
    id: 'load_15m',
    metrics: [{
      field: 'system.load.15',
      id: 'avg-load-15m',
      type: 'avg'
    }],
    split_mode: 'everything'
  }]
});

exports.hostLoad = hostLoad;