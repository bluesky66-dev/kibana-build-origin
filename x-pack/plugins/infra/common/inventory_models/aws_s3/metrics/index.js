"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;

var _aws_s3_bucket_size = require("./tsvb/aws_s3_bucket_size");

var _aws_s3_total_requests = require("./tsvb/aws_s3_total_requests");

var _aws_s3_number_of_objects = require("./tsvb/aws_s3_number_of_objects");

var _aws_s3_download_bytes = require("./tsvb/aws_s3_download_bytes");

var _aws_s3_upload_bytes = require("./tsvb/aws_s3_upload_bytes");

var _s3_bucket_size = require("./snapshot/s3_bucket_size");

var _s3_total_requests = require("./snapshot/s3_total_requests");

var _s3_number_of_objects = require("./snapshot/s3_number_of_objects");

var _s3_download_bytes = require("./snapshot/s3_download_bytes");

var _s3_upload_bytes = require("./snapshot/s3_upload_bytes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const metrics = {
  tsvb: {
    awsS3BucketSize: _aws_s3_bucket_size.awsS3BucketSize,
    awsS3TotalRequests: _aws_s3_total_requests.awsS3TotalRequests,
    awsS3NumberOfObjects: _aws_s3_number_of_objects.awsS3NumberOfObjects,
    awsS3DownloadBytes: _aws_s3_download_bytes.awsS3DownloadBytes,
    awsS3UploadBytes: _aws_s3_upload_bytes.awsS3UploadBytes
  },
  snapshot: {
    s3BucketSize: _s3_bucket_size.s3BucketSize,
    s3NumberOfObjects: _s3_number_of_objects.s3NumberOfObjects,
    s3TotalRequests: _s3_total_requests.s3TotalRequests,
    s3UploadBytes: _s3_upload_bytes.s3UploadBytes,
    s3DownloadBytes: _s3_download_bytes.s3DownloadBytes
  },
  defaultSnapshot: 's3BucketSize',
  defaultTimeRangeInSeconds: 86400 * 7 // 7 days

};
exports.metrics = metrics;