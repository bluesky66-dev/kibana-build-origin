"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getNodeSummary = getNodeSummary;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _error_missing_required = require("../../error_missing_required");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");

var _get_default_node_from_id = require("./get_default_node_from_id");

var _calculate_node_type = require("./calculate_node_type");

var _get_node_type_class_label = require("./get_node_type_class_label");
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
// @ts-ignore


function handleResponse(clusterState, shardStats, nodeUuid) {
  return response => {
    var _response$hits$hits, _response$hits, _response$hits2, _response$hits2$hits$, _response$hits2$hits$2, _response$hits2$hits$3, _response$hits3, _response$hits3$hits$, _response$hits4, _response$hits4$hits$, _response$hits4$hits$2;

    let nodeSummary = {};
    const nodeStatsHits = (_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : [];
    const nodes = nodeStatsHits.map(hit => {
      var _hit$_source$elastics;

      return ((_hit$_source$elastics = hit._source.elasticsearch) === null || _hit$_source$elastics === void 0 ? void 0 : _hit$_source$elastics.node) || hit._source.source_node;
    }); // using [0] value because query results are sorted desc per timestamp

    const node = nodes[0] || (0, _get_default_node_from_id.getDefaultNodeFromId)(nodeUuid);
    const sourceStats = ((_response$hits2 = response.hits) === null || _response$hits2 === void 0 ? void 0 : (_response$hits2$hits$ = _response$hits2.hits[0]) === null || _response$hits2$hits$ === void 0 ? void 0 : (_response$hits2$hits$2 = _response$hits2$hits$._source.elasticsearch) === null || _response$hits2$hits$2 === void 0 ? void 0 : (_response$hits2$hits$3 = _response$hits2$hits$2.node) === null || _response$hits2$hits$3 === void 0 ? void 0 : _response$hits2$hits$3.stats) || ((_response$hits3 = response.hits) === null || _response$hits3 === void 0 ? void 0 : (_response$hits3$hits$ = _response$hits3.hits[0]) === null || _response$hits3$hits$ === void 0 ? void 0 : _response$hits3$hits$._source.node_stats);
    const clusterNode = clusterState && clusterState.nodes ? clusterState.nodes[nodeUuid] : undefined;
    const stats = {
      resolver: nodeUuid,
      node_ids: nodes.map(_node => node.id || node.uuid),
      attributes: node.attributes,
      transport_address: ((_response$hits4 = response.hits) === null || _response$hits4 === void 0 ? void 0 : (_response$hits4$hits$ = _response$hits4.hits[0]) === null || _response$hits4$hits$ === void 0 ? void 0 : (_response$hits4$hits$2 = _response$hits4$hits$._source.service) === null || _response$hits4$hits$2 === void 0 ? void 0 : _response$hits4$hits$2.address) || node.transport_address,
      name: node.name,
      type: node.type
    };

    if (clusterNode) {
      var _sourceStats$indices, _sourceStats$indices$, _sourceStats$indices2, _sourceStats$indices3, _sourceStats$indices4, _sourceStats$indices5, _sourceStats$indices6, _sourceStats$fs, _sourceStats$fs$total, _sourceStats$fs2, _sourceStats$fs2$summ, _sourceStats$fs2$summ2, _sourceStats$fs3, _sourceStats$fs3$tota, _sourceStats$fs4, _sourceStats$fs4$summ, _sourceStats$fs4$summ2, _sourceStats$jvm, _sourceStats$jvm$mem, _sourceStats$jvm2, _sourceStats$jvm2$mem, _sourceStats$jvm2$mem2, _sourceStats$jvm2$mem3;

      const _shardStats = (0, _lodash.get)(shardStats, ['nodes', nodeUuid], {});

      const calculatedNodeType = (0, _calculate_node_type.calculateNodeType)(stats, (0, _lodash.get)(clusterState, 'master_node')); // set type for labeling / iconography

      const {
        nodeType,
        nodeTypeLabel,
        nodeTypeClass
      } = (0, _get_node_type_class_label.getNodeTypeClassLabel)(node, calculatedNodeType);
      nodeSummary = {
        type: nodeType,
        nodeTypeLabel,
        nodeTypeClass,
        totalShards: _shardStats.shardCount,
        indexCount: _shardStats.indexCount,
        documents: sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$indices = sourceStats.indices) === null || _sourceStats$indices === void 0 ? void 0 : (_sourceStats$indices$ = _sourceStats$indices.docs) === null || _sourceStats$indices$ === void 0 ? void 0 : _sourceStats$indices$.count,
        dataSize: (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$indices2 = sourceStats.indices) === null || _sourceStats$indices2 === void 0 ? void 0 : (_sourceStats$indices3 = _sourceStats$indices2.store) === null || _sourceStats$indices3 === void 0 ? void 0 : _sourceStats$indices3.size_in_bytes) || (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$indices4 = sourceStats.indices) === null || _sourceStats$indices4 === void 0 ? void 0 : (_sourceStats$indices5 = _sourceStats$indices4.store) === null || _sourceStats$indices5 === void 0 ? void 0 : (_sourceStats$indices6 = _sourceStats$indices5.size) === null || _sourceStats$indices6 === void 0 ? void 0 : _sourceStats$indices6.bytes),
        freeSpace: (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$fs = sourceStats.fs) === null || _sourceStats$fs === void 0 ? void 0 : (_sourceStats$fs$total = _sourceStats$fs.total) === null || _sourceStats$fs$total === void 0 ? void 0 : _sourceStats$fs$total.available_in_bytes) || (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$fs2 = sourceStats.fs) === null || _sourceStats$fs2 === void 0 ? void 0 : (_sourceStats$fs2$summ = _sourceStats$fs2.summary) === null || _sourceStats$fs2$summ === void 0 ? void 0 : (_sourceStats$fs2$summ2 = _sourceStats$fs2$summ.available) === null || _sourceStats$fs2$summ2 === void 0 ? void 0 : _sourceStats$fs2$summ2.bytes),
        totalSpace: (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$fs3 = sourceStats.fs) === null || _sourceStats$fs3 === void 0 ? void 0 : (_sourceStats$fs3$tota = _sourceStats$fs3.total) === null || _sourceStats$fs3$tota === void 0 ? void 0 : _sourceStats$fs3$tota.total_in_bytes) || (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$fs4 = sourceStats.fs) === null || _sourceStats$fs4 === void 0 ? void 0 : (_sourceStats$fs4$summ = _sourceStats$fs4.summary) === null || _sourceStats$fs4$summ === void 0 ? void 0 : (_sourceStats$fs4$summ2 = _sourceStats$fs4$summ.total) === null || _sourceStats$fs4$summ2 === void 0 ? void 0 : _sourceStats$fs4$summ2.bytes),
        usedHeap: (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$jvm = sourceStats.jvm) === null || _sourceStats$jvm === void 0 ? void 0 : (_sourceStats$jvm$mem = _sourceStats$jvm.mem) === null || _sourceStats$jvm$mem === void 0 ? void 0 : _sourceStats$jvm$mem.heap_used_percent) || (sourceStats === null || sourceStats === void 0 ? void 0 : (_sourceStats$jvm2 = sourceStats.jvm) === null || _sourceStats$jvm2 === void 0 ? void 0 : (_sourceStats$jvm2$mem = _sourceStats$jvm2.mem) === null || _sourceStats$jvm2$mem === void 0 ? void 0 : (_sourceStats$jvm2$mem2 = _sourceStats$jvm2$mem.heap) === null || _sourceStats$jvm2$mem2 === void 0 ? void 0 : (_sourceStats$jvm2$mem3 = _sourceStats$jvm2$mem2.used) === null || _sourceStats$jvm2$mem3 === void 0 ? void 0 : _sourceStats$jvm2$mem3.pct),
        status: _i18n.i18n.translate('xpack.monitoring.es.nodes.onlineStatusLabel', {
          defaultMessage: 'Online'
        }),
        isOnline: true
      };
    } else {
      nodeSummary = {
        nodeTypeLabel: _i18n.i18n.translate('xpack.monitoring.es.nodes.offlineNodeStatusLabel', {
          defaultMessage: 'Offline Node'
        }),
        status: _i18n.i18n.translate('xpack.monitoring.es.nodes.offlineStatusLabel', {
          defaultMessage: 'Offline'
        }),
        isOnline: false
      };
    }

    return { ...stats,
      ...nodeSummary
    };
  };
}

function getNodeSummary(req, esIndexPattern, clusterState, shardStats, {
  clusterUuid,
  nodeUuid,
  start,
  end
}) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in elasticsearch/getNodeSummary'); // Build up the Elasticsearch request

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const filters = [{
    term: {
      'source_node.uuid': nodeUuid
    }
  }];
  const params = {
    index: esIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type: 'node_stats',
        start,
        end,
        clusterUuid,
        metric,
        filters
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse(clusterState, shardStats, nodeUuid));
}