"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsEC2DiskIOBytes = void 0;

var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsEC2DiskIOBytes = (0, _create_tsvb_model.createTSVBModel)('awsEC2DiskIOBytes', ['aws.ec2'], [{
  id: 'write',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.ec2.diskio.write.bytes_per_sec',
    id: 'avg-write',
    type: 'avg'
  }]
}, {
  id: 'read',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.ec2.diskio.read.bytes_per_sec',
    id: 'avg-read',
    type: 'avg'
  }, {
    id: 'calculation-rate',
    type: 'calculation',
    variables: [{
      id: 'rate-var',
      name: 'rate',
      field: 'avg-read'
    }],
    script: 'params.rate * -1'
  }]
}]);
exports.awsEC2DiskIOBytes = awsEC2DiskIOBytes;