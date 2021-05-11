"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getShardAllocation = getShardAllocation;

var _error_missing_required = require("../../error_missing_required");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(response) {
  var _response$hits;

  const hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits;

  if (!hits) {
    return [];
  } // deduplicate any shards from earlier days with the same cluster state state_uuid


  const uniqueShards = new Set(); // map into object with shard and source properties

  return hits.reduce((shards, hit) => {
    const shard = hit._source.shard;

    if (shard) {
      // note: if the request is for a node, then it's enough to deduplicate without primary, but for indices it displays both
      const shardId = `${shard.index}-${shard.shard}-${shard.primary}-${shard.relocating_node}-${shard.node}`;

      if (!uniqueShards.has(shardId)) {
        shards.push(shard);
        uniqueShards.add(shardId);
      }
    }

    return shards;
  }, []);
}

function getShardAllocation(req, esIndexPattern, {
  shardFilter,
  stateUuid,
  showSystemIndices = false
}) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getShardAllocation');
  const filters = [{
    term: {
      state_uuid: stateUuid
    }
  }, shardFilter];

  if (!showSystemIndices) {
    filters.push({
      bool: {
        must_not: [{
          prefix: {
            'shard.index': '.'
          }
        }]
      }
    });
  }

  const config = req.server.config();
  const clusterUuid = req.params.clusterUuid;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const params = {
    index: esIndexPattern,
    size: config.get('monitoring.ui.max_bucket_size'),
    ignoreUnavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        type: 'shards',
        clusterUuid,
        metric,
        filters
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}