"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogEntryRateBuckets = getLogEntryRateBuckets;

var _runtime_types = require("../../../common/runtime_types");

var _queries = require("./queries");

var _log_analysis = require("../../../common/log_analysis");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const COMPOSITE_AGGREGATION_BATCH_SIZE = 1000;

async function getLogEntryRateBuckets(context, sourceId, startTime, endTime, bucketDuration, datasets) {
  const logRateJobId = (0, _log_analysis.getJobId)(context.infra.spaceId, sourceId, 'log-entry-rate');
  let mlModelPlotBuckets = [];
  let afterLatestBatchKey;

  while (true) {
    var _decodeOrThrow$aggreg, _decodeOrThrow$aggreg2;

    const mlModelPlotResponse = await context.infra.mlSystem.mlAnomalySearch((0, _queries.createLogEntryRateQuery)(logRateJobId, startTime, endTime, bucketDuration, COMPOSITE_AGGREGATION_BATCH_SIZE, afterLatestBatchKey, datasets), [logRateJobId]);
    const {
      after_key: afterKey,
      buckets: latestBatchBuckets = []
    } = (_decodeOrThrow$aggreg = (_decodeOrThrow$aggreg2 = (0, _runtime_types.decodeOrThrow)(_queries.logRateModelPlotResponseRT)(mlModelPlotResponse).aggregations) === null || _decodeOrThrow$aggreg2 === void 0 ? void 0 : _decodeOrThrow$aggreg2.timestamp_partition_buckets) !== null && _decodeOrThrow$aggreg !== void 0 ? _decodeOrThrow$aggreg : {};
    mlModelPlotBuckets = [...mlModelPlotBuckets, ...latestBatchBuckets];
    afterLatestBatchKey = afterKey;

    if (afterKey == null || latestBatchBuckets.length < COMPOSITE_AGGREGATION_BATCH_SIZE) {
      break;
    }
  }

  return mlModelPlotBuckets.reduce((histogramBuckets, timestampPartitionBucket) => {
    const previousHistogramBucket = histogramBuckets[histogramBuckets.length - 1];
    const partition = {
      analysisBucketCount: timestampPartitionBucket.filter_model_plot.doc_count,
      anomalies: timestampPartitionBucket.filter_records.top_hits_record.hits.hits.map(({
        _id,
        _source: record
      }) => ({
        id: _id,
        actualLogEntryRate: record.actual[0],
        anomalyScore: record.record_score,
        duration: record.bucket_span * 1000,
        startTime: record.timestamp,
        typicalLogEntryRate: record.typical[0]
      })),
      averageActualLogEntryRate: timestampPartitionBucket.filter_model_plot.average_actual.value || 0,
      maximumAnomalyScore: timestampPartitionBucket.filter_records.maximum_record_score.value || 0,
      numberOfLogEntries: timestampPartitionBucket.filter_model_plot.sum_actual.value || 0,
      partitionId: timestampPartitionBucket.key.partition
    };

    if (previousHistogramBucket && previousHistogramBucket.startTime === timestampPartitionBucket.key.timestamp) {
      return [...histogramBuckets.slice(0, -1), { ...previousHistogramBucket,
        partitions: [...previousHistogramBucket.partitions, partition]
      }];
    } else {
      return [...histogramBuckets, {
        partitions: [partition],
        startTime: timestampPartitionBucket.key.timestamp
      }];
    }
  }, []);
}