"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getNodeInfo = getNodeInfo;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _calculate_availability = require("../calculate_availability");

var _constants = require("../../../common/constants");

var _standalone_cluster_query_filter = require("../standalone_clusters/standalone_cluster_query_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


function handleResponse(resp) {
  var _resp$hits, _resp$hits$hits$, _resp$hits$hits$$_sou, _source$queue, _source$jvm;

  const source = (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : (_resp$hits$hits$ = _resp$hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : (_resp$hits$hits$$_sou = _resp$hits$hits$._source) === null || _resp$hits$hits$$_sou === void 0 ? void 0 : _resp$hits$hits$$_sou.logstash_stats;
  const logstash = source === null || source === void 0 ? void 0 : source.logstash;
  const info = (0, _lodash.merge)(logstash, {
    availability: (0, _calculate_availability.calculateAvailability)(source === null || source === void 0 ? void 0 : source.timestamp),
    events: source === null || source === void 0 ? void 0 : source.events,
    reloads: source === null || source === void 0 ? void 0 : source.reloads,
    queue_type: source === null || source === void 0 ? void 0 : (_source$queue = source.queue) === null || _source$queue === void 0 ? void 0 : _source$queue.type,
    uptime: source === null || source === void 0 ? void 0 : (_source$jvm = source.jvm) === null || _source$jvm === void 0 ? void 0 : _source$jvm.uptime_in_millis
  });
  return info;
}

function getNodeInfo(req, lsIndexPattern, {
  clusterUuid,
  logstashUuid
}) {
  (0, _error_missing_required.checkParam)(lsIndexPattern, 'lsIndexPattern in getNodeInfo');
  const isStandaloneCluster = clusterUuid === _constants.STANDALONE_CLUSTER_CLUSTER_UUID;
  const clusterFilter = isStandaloneCluster ? _standalone_cluster_query_filter.standaloneClusterFilter : {
    term: {
      cluster_uuid: clusterUuid
    }
  };
  const params = {
    index: lsIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.logstash_stats.events', 'hits.hits._source.logstash_stats.jvm.uptime_in_millis', 'hits.hits._source.logstash_stats.logstash', 'hits.hits._source.logstash_stats.queue.type', 'hits.hits._source.logstash_stats.reloads', 'hits.hits._source.logstash_stats.timestamp'],
    body: {
      query: {
        bool: {
          filter: [clusterFilter, {
            term: {
              'logstash_stats.logstash.uuid': logstashUuid
            }
          }]
        }
      },
      collapse: {
        field: 'logstash_stats.logstash.uuid'
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }]
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse);
}