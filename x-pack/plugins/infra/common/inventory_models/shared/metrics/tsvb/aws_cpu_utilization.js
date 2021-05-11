"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsCpuUtilization = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const awsCpuUtilization = (timeField, indexPattern) => ({
  id: 'awsCpuUtilization',
  requires: ['aws.ec2'],
  map_field_to: 'cloud.instance.id',
  id_type: 'cloud',
  index_pattern: indexPattern,
  interval: '>=5m',
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'cpu-util',
    metrics: [{
      field: 'aws.ec2.cpu.total.pct',
      id: 'avg-cpu-util',
      type: 'avg'
    }],
    split_mode: 'everything'
  }]
});

exports.awsCpuUtilization = awsCpuUtilization;