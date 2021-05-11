"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.getKibanaInfo = getKibanaInfo;

var _lodash = require("lodash");

var _error_missing_required = require("../error_missing_required");

var _calculate_availability = require("../calculate_availability");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function handleResponse(resp) {
  var _resp$hits, _resp$hits$hits$, _source$os, _source$os$memory, _source$process;

  const source = (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : (_resp$hits$hits$ = _resp$hits.hits[0]) === null || _resp$hits$hits$ === void 0 ? void 0 : _resp$hits$hits$._source.kibana_stats;
  const kibana = source === null || source === void 0 ? void 0 : source.kibana;
  return (0, _lodash.merge)(kibana, {
    availability: (0, _calculate_availability.calculateAvailability)(source === null || source === void 0 ? void 0 : source.timestamp),
    os_memory_free: source === null || source === void 0 ? void 0 : (_source$os = source.os) === null || _source$os === void 0 ? void 0 : (_source$os$memory = _source$os.memory) === null || _source$os$memory === void 0 ? void 0 : _source$os$memory.free_in_bytes,
    uptime: source === null || source === void 0 ? void 0 : (_source$process = source.process) === null || _source$process === void 0 ? void 0 : _source$process.uptime_in_millis
  });
}

function getKibanaInfo(req, kbnIndexPattern, {
  clusterUuid,
  kibanaUuid
}) {
  (0, _error_missing_required.checkParam)(kbnIndexPattern, 'kbnIndexPattern in getKibanaInfo');
  const params = {
    index: kbnIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.kibana_stats.kibana', 'hits.hits._source.kibana_stats.os.memory.free_in_bytes', 'hits.hits._source.kibana_stats.process.uptime_in_millis', 'hits.hits._source.kibana_stats.timestamp'],
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              cluster_uuid: clusterUuid
            }
          }, {
            term: {
              'kibana_stats.kibana.uuid': kibanaUuid
            }
          }]
        }
      },
      collapse: {
        field: 'kibana_stats.kibana.uuid'
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