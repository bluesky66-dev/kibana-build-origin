"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsS3 = void 0;

var _i18n = require("@kbn/i18n");

var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const awsS3 = {
  id: 'awsS3',
  displayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsS3.displayName', {
    defaultMessage: 'S3 Buckets'
  }),
  singularDisplayName: _i18n.i18n.translate('xpack.infra.inventoryModels.awsS3.singularDisplayName', {
    defaultMessage: 'S3 Bucket'
  }),
  requiredModule: 'aws',
  crosslinkSupport: {
    details: true,
    logs: true,
    apm: false,
    uptime: false
  },
  metrics: _metrics.metrics,
  fields: {
    id: 'aws.s3.bucket.name',
    name: 'aws.s3.bucket.name'
  },
  requiredMetrics: ['awsS3BucketSize', 'awsS3NumberOfObjects', 'awsS3TotalRequests', 'awsS3DownloadBytes', 'awsS3UploadBytes'],
  tooltipMetrics: ['s3BucketSize', 's3NumberOfObjects', 's3TotalRequests', 's3UploadBytes', 's3DownloadBytes']
};
exports.awsS3 = awsS3;