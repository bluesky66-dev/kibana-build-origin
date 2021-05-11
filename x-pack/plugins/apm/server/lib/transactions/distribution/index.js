"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDistribution = getTransactionDistribution;

var _get_buckets = require("./get_buckets");

var _get_distribution_max = require("./get_distribution_max");

var _round_to_nearest_five_or_ten = require("../../helpers/round_to_nearest_five_or_ten");

var _constants = require("../constants");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getBucketSize(max) {
  const bucketSize = max / _constants.BUCKET_TARGET_COUNT;
  return (0, _round_to_nearest_five_or_ten.roundToNearestFiveOrTen)(bucketSize > _constants.MINIMUM_BUCKET_SIZE ? bucketSize : _constants.MINIMUM_BUCKET_SIZE);
}

async function getTransactionDistribution({
  environment,
  serviceName,
  transactionName,
  transactionType,
  transactionId,
  traceId,
  setup,
  searchAggregatedTransactions
}) {
  return (0, _with_apm_span.withApmSpan)('get_transaction_latency_distribution', async () => {
    const distributionMax = await (0, _get_distribution_max.getDistributionMax)({
      environment,
      serviceName,
      transactionName,
      transactionType,
      setup,
      searchAggregatedTransactions
    });

    if (distributionMax == null) {
      return {
        noHits: true,
        buckets: [],
        bucketSize: 0
      };
    }

    const bucketSize = getBucketSize(distributionMax);
    const {
      buckets,
      noHits
    } = await (0, _get_buckets.getBuckets)({
      environment,
      serviceName,
      transactionName,
      transactionType,
      transactionId,
      traceId,
      distributionMax,
      bucketSize,
      setup,
      searchAggregatedTransactions
    });
    return {
      noHits,
      buckets,
      bucketSize
    };
  });
}