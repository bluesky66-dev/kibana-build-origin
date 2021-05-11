"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hostFilesystem = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hostFilesystem = (timeField, indexPattern, interval) => ({
  id: 'hostFilesystem',
  requires: ['system.filesystem'],
  filter: 'system.filesystem.device_name:\\/*',
  index_pattern: indexPattern,
  time_field: timeField,
  interval,
  type: 'timeseries',
  series: [{
    id: 'used',
    metrics: [{
      field: 'system.filesystem.used.pct',
      id: 'avg-filesystem-used',
      type: 'avg'
    }],
    split_mode: 'terms',
    terms_field: 'system.filesystem.device_name',
    terms_order_by: 'used',
    terms_size: 5
  }]
});

exports.hostFilesystem = hostFilesystem;