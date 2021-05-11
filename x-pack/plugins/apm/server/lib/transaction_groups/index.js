"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionGroupList = getTransactionGroupList;

var _fetcher = require("./fetcher");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTransactionGroupList(options, setup) {
  const bucketSize = setup.config['xpack.apm.ui.transactionGroupBucketSize'];
  return await (0, _fetcher.transactionGroupsFetcher)(options, setup, bucketSize);
}