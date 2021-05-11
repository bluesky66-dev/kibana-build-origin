"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsRDSLatency = void 0;

var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsRDSLatency = (0, _create_tsvb_model.createTSVBModel)('awsRDSLatency', ['aws.rds'], [{
  id: 'read',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.rds.latency.read',
    id: 'avg',
    type: 'avg'
  }]
}, {
  id: 'write',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.rds.latency.write',
    id: 'avg',
    type: 'avg'
  }]
}, {
  id: 'insert',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.rds.latency.insert',
    id: 'avg',
    type: 'avg'
  }]
}, {
  id: 'update',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.rds.latency.update',
    id: 'avg',
    type: 'avg'
  }]
}, {
  id: 'commit',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.rds.latency.commit',
    id: 'avg',
    type: 'avg'
  }]
}]);
exports.awsRDSLatency = awsRDSLatency;