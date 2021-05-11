"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMlJob = fetchMlJob;
exports.getLogEntryDatasets = getLogEntryDatasets;
exports.COMPOSITE_AGGREGATION_BATCH_SIZE = void 0;

var _errors = require("./errors");

var _log_entry_data_sets = require("./queries/log_entry_data_sets");

var _runtime_types = require("../../../common/runtime_types");

var _performance_tracing = require("../../../common/performance_tracing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchMlJob(mlAnomalyDetectors, jobId) {
  const finalizeMlGetJobSpan = (0, _performance_tracing.startTracingSpan)('Fetch ml job from ES');
  const {
    jobs: [mlJob]
  } = await mlAnomalyDetectors.jobs(jobId);
  const mlGetJobSpan = finalizeMlGetJobSpan();

  if (mlJob == null) {
    throw new _errors.NoLogAnalysisMlJobError(`Failed to find ml job ${jobId}.`);
  }

  return {
    mlJob,
    timing: {
      spans: [mlGetJobSpan]
    }
  };
}

const COMPOSITE_AGGREGATION_BATCH_SIZE = 1000; // Finds datasets related to ML job ids

exports.COMPOSITE_AGGREGATION_BATCH_SIZE = COMPOSITE_AGGREGATION_BATCH_SIZE;

async function getLogEntryDatasets(mlSystem, startTime, endTime, jobIds) {
  const finalizeLogEntryDatasetsSpan = (0, _performance_tracing.startTracingSpan)('get data sets');
  let logEntryDatasetBuckets = [];
  let afterLatestBatchKey;
  let esSearchSpans = [];

  while (true) {
    var _logEntryDatasetsResp, _logEntryDatasetsResp2;

    const finalizeEsSearchSpan = (0, _performance_tracing.startTracingSpan)('fetch log entry dataset batch from ES');
    const logEntryDatasetsResponse = (0, _runtime_types.decodeOrThrow)(_log_entry_data_sets.logEntryDatasetsResponseRT)(await mlSystem.mlAnomalySearch((0, _log_entry_data_sets.createLogEntryDatasetsQuery)(jobIds, startTime, endTime, COMPOSITE_AGGREGATION_BATCH_SIZE, afterLatestBatchKey), jobIds));
    const {
      after_key: afterKey,
      buckets: latestBatchBuckets = []
    } = (_logEntryDatasetsResp = (_logEntryDatasetsResp2 = logEntryDatasetsResponse.aggregations) === null || _logEntryDatasetsResp2 === void 0 ? void 0 : _logEntryDatasetsResp2.dataset_buckets) !== null && _logEntryDatasetsResp !== void 0 ? _logEntryDatasetsResp : {};
    logEntryDatasetBuckets = [...logEntryDatasetBuckets, ...latestBatchBuckets];
    afterLatestBatchKey = afterKey;
    esSearchSpans = [...esSearchSpans, finalizeEsSearchSpan()];

    if (latestBatchBuckets.length < COMPOSITE_AGGREGATION_BATCH_SIZE) {
      break;
    }
  }

  const logEntryDatasetsSpan = finalizeLogEntryDatasetsSpan();
  return {
    data: logEntryDatasetBuckets.map(logEntryDatasetBucket => logEntryDatasetBucket.key.dataset),
    timing: {
      spans: [logEntryDatasetsSpan, ...esSearchSpans]
    }
  };
}