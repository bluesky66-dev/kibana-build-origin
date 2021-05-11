"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsS3DownloadBytes = void 0;

var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsS3DownloadBytes = (0, _create_tsvb_model.createTSVBModel)('awsS3DownloadBytes', ['aws.s3_request'], [{
  id: 'bytes',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.s3_request.downloaded.bytes',
    id: 'max-bytes',
    type: 'max'
  }]
}], '>=300s');
exports.awsS3DownloadBytes = awsS3DownloadBytes;