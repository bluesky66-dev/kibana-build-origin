"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsRDSActiveTransactions = void 0;

var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsRDSActiveTransactions = (0, _create_tsvb_model.createTSVBModel)('awsRDSActiveTransactions', ['aws.rds'], [{
  id: 'active',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.rds.transactions.active',
    id: 'avg',
    type: 'avg'
  }]
}, {
  id: 'blocked',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.rds.transactions.blocked',
    id: 'avg',
    type: 'avg'
  }]
}]);
exports.awsRDSActiveTransactions = awsRDSActiveTransactions;