"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.buildGetIndicesQuery = buildGetIndicesQuery;
exports.getIndices = getIndices;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _error_missing_required = require("../../error_missing_required");

var _metrics = require("../../metrics");

var _create_query = require("../../create_query");

var _calculate_rate = require("../../calculate_rate");

var _shards = require("../shards");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(resp, min, max, shardStats) {
  var _resp$hits$hits, _resp$hits; // map the hits


  const hits = (_resp$hits$hits = resp === null || resp === void 0 ? void 0 : (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : _resp$hits.hits) !== null && _resp$hits$hits !== void 0 ? _resp$hits$hits : [];
  return hits.map(hit => {
    var _hit$inner_hits, _hit$inner_hits$earli, _hit$inner_hits$earli2, _hit$inner_hits$earli3, _hit$inner_hits2, _hit$inner_hits2$earl, _hit$inner_hits2$earl2, _hit$inner_hits2$earl3, _earliestStats$primar, _stats$primaries, _stats$primaries$inde, _earliestStats$total, _stats$total, _stats$total$search, _stats$index, _stats$primaries2, _stats$primaries2$doc, _stats$total2, _stats$total2$store;

    const stats = hit._source.index_stats;
    const earliestStats = (_hit$inner_hits = hit.inner_hits) === null || _hit$inner_hits === void 0 ? void 0 : (_hit$inner_hits$earli = _hit$inner_hits.earliest) === null || _hit$inner_hits$earli === void 0 ? void 0 : (_hit$inner_hits$earli2 = _hit$inner_hits$earli.hits) === null || _hit$inner_hits$earli2 === void 0 ? void 0 : (_hit$inner_hits$earli3 = _hit$inner_hits$earli2.hits[0]) === null || _hit$inner_hits$earli3 === void 0 ? void 0 : _hit$inner_hits$earli3._source.index_stats;
    const rateOptions = {
      hitTimestamp: hit._source.timestamp,
      earliestHitTimestamp: (_hit$inner_hits2 = hit.inner_hits) === null || _hit$inner_hits2 === void 0 ? void 0 : (_hit$inner_hits2$earl = _hit$inner_hits2.earliest) === null || _hit$inner_hits2$earl === void 0 ? void 0 : (_hit$inner_hits2$earl2 = _hit$inner_hits2$earl.hits) === null || _hit$inner_hits2$earl2 === void 0 ? void 0 : (_hit$inner_hits2$earl3 = _hit$inner_hits2$earl2.hits[0]) === null || _hit$inner_hits2$earl3 === void 0 ? void 0 : _hit$inner_hits2$earl3._source.timestamp,
      timeWindowMin: min,
      timeWindowMax: max
    };
    const earliestIndexingHit = earliestStats === null || earliestStats === void 0 ? void 0 : (_earliestStats$primar = earliestStats.primaries) === null || _earliestStats$primar === void 0 ? void 0 : _earliestStats$primar.indexing;
    const {
      rate: indexRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: stats === null || stats === void 0 ? void 0 : (_stats$primaries = stats.primaries) === null || _stats$primaries === void 0 ? void 0 : (_stats$primaries$inde = _stats$primaries.indexing) === null || _stats$primaries$inde === void 0 ? void 0 : _stats$primaries$inde.index_total,
      earliestTotal: earliestIndexingHit === null || earliestIndexingHit === void 0 ? void 0 : earliestIndexingHit.index_total,
      ...rateOptions
    });
    const earliestSearchHit = earliestStats === null || earliestStats === void 0 ? void 0 : (_earliestStats$total = earliestStats.total) === null || _earliestStats$total === void 0 ? void 0 : _earliestStats$total.search;
    const {
      rate: searchRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: stats === null || stats === void 0 ? void 0 : (_stats$total = stats.total) === null || _stats$total === void 0 ? void 0 : (_stats$total$search = _stats$total.search) === null || _stats$total$search === void 0 ? void 0 : _stats$total$search.query_total,
      earliestTotal: earliestSearchHit === null || earliestSearchHit === void 0 ? void 0 : earliestSearchHit.query_total,
      ...rateOptions
    });
    const shardStatsForIndex = (0, _lodash.get)(shardStats, ['indices', (_stats$index = stats === null || stats === void 0 ? void 0 : stats.index) !== null && _stats$index !== void 0 ? _stats$index : '']);
    let status;
    let statusSort;
    let unassignedShards;

    if (shardStatsForIndex && shardStatsForIndex.status) {
      status = shardStatsForIndex.status;
      unassignedShards = (0, _shards.getUnassignedShards)(shardStatsForIndex); // create a numerical status value for sorting

      if (status === 'green') {
        statusSort = 1;
      } else if (status === 'yellow') {
        statusSort = 2;
      } else {
        statusSort = 3;
      }
    } else {
      status = _i18n.i18n.translate('xpack.monitoring.es.indices.deletedClosedStatusLabel', {
        defaultMessage: 'Deleted / Closed'
      });
      statusSort = 0;
    }

    return {
      name: stats === null || stats === void 0 ? void 0 : stats.index,
      status,
      doc_count: stats === null || stats === void 0 ? void 0 : (_stats$primaries2 = stats.primaries) === null || _stats$primaries2 === void 0 ? void 0 : (_stats$primaries2$doc = _stats$primaries2.docs) === null || _stats$primaries2$doc === void 0 ? void 0 : _stats$primaries2$doc.count,
      data_size: stats === null || stats === void 0 ? void 0 : (_stats$total2 = stats.total) === null || _stats$total2 === void 0 ? void 0 : (_stats$total2$store = _stats$total2.store) === null || _stats$total2$store === void 0 ? void 0 : _stats$total2$store.size_in_bytes,
      index_rate: indexRate,
      search_rate: searchRate,
      unassigned_shards: unassignedShards,
      status_sort: statusSort
    };
  });
}

function buildGetIndicesQuery(esIndexPattern, clusterUuid, {
  start,
  end,
  size,
  showSystemIndices = false
}) {
  const filters = [];

  if (!showSystemIndices) {
    filters.push({
      bool: {
        must_not: [{
          prefix: {
            'index_stats.index': '.'
          }
        }]
      }
    });
  }

  const metricFields = _metrics.ElasticsearchMetric.getMetricFields();

  return {
    index: esIndexPattern,
    size,
    ignoreUnavailable: true,
    filterPath: [// only filter path can filter for inner_hits
    'hits.hits._source.index_stats.index', 'hits.hits._source.index_stats.primaries.docs.count', 'hits.hits._source.index_stats.total.store.size_in_bytes', // latest hits for calculating metrics
    'hits.hits._source.timestamp', 'hits.hits._source.index_stats.primaries.indexing.index_total', 'hits.hits._source.index_stats.total.search.query_total', // earliest hits for calculating metrics
    'hits.hits.inner_hits.earliest.hits.hits._source.timestamp', 'hits.hits.inner_hits.earliest.hits.hits._source.index_stats.primaries.indexing.index_total', 'hits.hits.inner_hits.earliest.hits.hits._source.index_stats.total.search.query_total'],
    body: {
      query: (0, _create_query.createQuery)({
        type: 'index_stats',
        start,
        end,
        clusterUuid,
        metric: metricFields,
        filters
      }),
      collapse: {
        field: 'index_stats.index',
        inner_hits: {
          name: 'earliest',
          size: 1,
          sort: [{
            timestamp: {
              order: 'asc',
              unmapped_type: 'long'
            }
          }]
        }
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }]
    }
  };
}

function getIndices(req, esIndexPattern, showSystemIndices = false, shardStats) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getIndices');
  const {
    min: start,
    max: end
  } = req.payload.timeRange;
  const clusterUuid = req.params.clusterUuid;
  const config = req.server.config();
  const params = buildGetIndicesQuery(esIndexPattern, clusterUuid, {
    start,
    end,
    showSystemIndices,
    size: parseInt(config.get('monitoring.ui.max_bucket_size') || '', 10)
  });
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(resp => handleResponse(resp, start, end, shardStats));
}