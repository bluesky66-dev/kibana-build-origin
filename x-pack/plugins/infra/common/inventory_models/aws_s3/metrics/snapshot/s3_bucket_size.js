"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3BucketSize = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const s3BucketSize = {
  s3BucketSize: {
    max: {
      field: 'aws.s3_daily_storage.bucket.size.bytes'
    }
  }
};
exports.s3BucketSize = s3BucketSize;