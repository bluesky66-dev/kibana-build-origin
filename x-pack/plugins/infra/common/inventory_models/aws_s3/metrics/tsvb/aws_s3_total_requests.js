"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsS3TotalRequests = void 0;

var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsS3TotalRequests = (0, _create_tsvb_model.createTSVBModel)('awsS3TotalRequests', ['aws.s3_request'], [{
  id: 'total',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.s3_request.requests.total',
    id: 'max-size',
    type: 'max'
  }]
}], '>=300s');
exports.awsS3TotalRequests = awsS3TotalRequests;