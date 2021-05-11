"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorDistribution = getErrorDistribution;

var _constants = require("../../transactions/constants");

var _get_buckets = require("./get_buckets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getBucketSize({
  start,
  end
}) {
  return Math.floor((end - start) / _constants.BUCKET_TARGET_COUNT);
}

async function getErrorDistribution({
  environment,
  serviceName,
  groupId,
  setup
}) {
  const bucketSize = getBucketSize({
    start: setup.start,
    end: setup.end
  });
  const {
    buckets,
    noHits
  } = await (0, _get_buckets.getBuckets)({
    environment,
    serviceName,
    groupId,
    bucketSize,
    setup
  });
  return {
    noHits,
    buckets,
    bucketSize
  };
}