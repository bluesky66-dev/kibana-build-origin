"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsEC2NetworkTraffic = void 0;

var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsEC2NetworkTraffic = (0, _create_tsvb_model.createTSVBModel)('awsEC2NetworkTraffic', ['aws.ec2'], [{
  id: 'tx',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.ec2.network.out.bytes_per_sec',
    id: 'avg-tx',
    type: 'avg'
  }]
}, {
  id: 'rx',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.ec2.network.in.bytes_per_sec',
    id: 'avg-rx',
    type: 'avg'
  }, {
    id: 'calculation-rate',
    type: 'calculation',
    variables: [{
      id: 'rate-var',
      name: 'rate',
      field: 'avg-rx'
    }],
    script: 'params.rate * -1'
  }]
}]);
exports.awsEC2NetworkTraffic = awsEC2NetworkTraffic;