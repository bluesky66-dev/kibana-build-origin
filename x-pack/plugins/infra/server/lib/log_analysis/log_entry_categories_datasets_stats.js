"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestLogEntriesCategoriesDatasetsStats = getLatestLogEntriesCategoriesDatasetsStats;

var _performance_tracing = require("../../../common/performance_tracing");

var _runtime_types = require("../../../common/runtime_types");

var _common = require("./common");

var _latest_log_entry_categories_datasets_stats = require("./queries/latest_log_entry_categories_datasets_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getLatestLogEntriesCategoriesDatasetsStats(context, jobIds, startTime, endTime, includeCategorizerStatuses = []) {
  const finalizeLogEntryCategoriesDatasetsStats = (0, _performance_tracing.startTracingSpan)('get categories datasets stats');
  let latestLogEntryCategoriesDatasetsStatsBuckets = [];
  let afterLatestBatchKey;

  while (true) {
    var _decodeOrThrow$aggreg, _decodeOrThrow$aggreg2;

    const latestLogEntryCategoriesDatasetsStatsResponse = await context.infra.mlSystem.mlAnomalySearch((0, _latest_log_entry_categories_datasets_stats.createLatestLogEntryCategoriesDatasetsStatsQuery)(jobIds, startTime, endTime, _common.COMPOSITE_AGGREGATION_BATCH_SIZE, afterLatestBatchKey), jobIds);
    const {
      after_key: afterKey,
      buckets: latestBatchBuckets = []
    } = (_decodeOrThrow$aggreg = (_decodeOrThrow$aggreg2 = (0, _runtime_types.decodeOrThrow)(_latest_log_entry_categories_datasets_stats.latestLogEntryCategoriesDatasetsStatsResponseRT)(latestLogEntryCategoriesDatasetsStatsResponse).aggregations) === null || _decodeOrThrow$aggreg2 === void 0 ? void 0 : _decodeOrThrow$aggreg2.dataset_composite_terms) !== null && _decodeOrThrow$aggreg !== void 0 ? _decodeOrThrow$aggreg : {};
    const latestIncludedBatchBuckets = includeCategorizerStatuses.length > 0 ? latestBatchBuckets.filter(bucket => bucket.categorizer_stats_top_hits.hits.hits.some(hit => includeCategorizerStatuses.includes(hit._source.categorization_status))) : latestBatchBuckets;
    latestLogEntryCategoriesDatasetsStatsBuckets = [...latestLogEntryCategoriesDatasetsStatsBuckets, ...latestIncludedBatchBuckets];
    afterLatestBatchKey = afterKey;

    if (afterKey == null || latestBatchBuckets.length < _common.COMPOSITE_AGGREGATION_BATCH_SIZE) {
      break;
    }
  }

  const logEntryCategoriesDatasetsStatsSpan = finalizeLogEntryCategoriesDatasetsStats();
  return {
    data: latestLogEntryCategoriesDatasetsStatsBuckets.map(bucket => {
      var _bucket$key$dataset, _bucket$key;

      const latestHitSource = bucket.categorizer_stats_top_hits.hits.hits[0]._source;
      return {
        categorization_status: latestHitSource.categorization_status,
        categorized_doc_count: latestHitSource.categorized_doc_count,
        dataset: (_bucket$key$dataset = (_bucket$key = bucket.key) === null || _bucket$key === void 0 ? void 0 : _bucket$key.dataset) !== null && _bucket$key$dataset !== void 0 ? _bucket$key$dataset : '',
        dead_category_count: latestHitSource.dead_category_count,
        failed_category_count: latestHitSource.failed_category_count,
        frequent_category_count: latestHitSource.frequent_category_count,
        job_id: latestHitSource.job_id,
        log_time: latestHitSource.log_time,
        rare_category_count: latestHitSource.rare_category_count,
        total_category_count: latestHitSource.total_category_count
      };
    }),
    timing: {
      spans: [logEntryCategoriesDatasetsStatsSpan]
    }
  };
}