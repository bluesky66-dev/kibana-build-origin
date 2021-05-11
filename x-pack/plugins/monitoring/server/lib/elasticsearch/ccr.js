"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponse = handleResponse;
exports.checkCcrEnabled = checkCcrEnabled;

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("../error_missing_required");

var _metrics = require("../metrics");

var _create_query = require("../create_query");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
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
  var _response$hits$hits$, _response$hits, _response$hits$hits$2, _response$hits$hits$3, _response$hits$hits$4, _response$hits$hits$5, _response$hits$hits$6, _response$hits2, _response$hits2$hits$, _response$hits2$hits$2, _response$hits2$hits$3, _response$hits2$hits$4;

  const isEnabled = (_response$hits$hits$ = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : (_response$hits$hits$2 = _response$hits.hits[0]) === null || _response$hits$hits$2 === void 0 ? void 0 : (_response$hits$hits$3 = _response$hits$hits$2._source.stack_stats) === null || _response$hits$hits$3 === void 0 ? void 0 : (_response$hits$hits$4 = _response$hits$hits$3.xpack) === null || _response$hits$hits$4 === void 0 ? void 0 : (_response$hits$hits$5 = _response$hits$hits$4.ccr) === null || _response$hits$hits$5 === void 0 ? void 0 : _response$hits$hits$5.enabled) !== null && _response$hits$hits$ !== void 0 ? _response$hits$hits$ : undefined;
  const isAvailable = (_response$hits$hits$6 = (_response$hits2 = response.hits) === null || _response$hits2 === void 0 ? void 0 : (_response$hits2$hits$ = _response$hits2.hits[0]) === null || _response$hits2$hits$ === void 0 ? void 0 : (_response$hits2$hits$2 = _response$hits2$hits$._source.stack_stats) === null || _response$hits2$hits$2 === void 0 ? void 0 : (_response$hits2$hits$3 = _response$hits2$hits$2.xpack) === null || _response$hits2$hits$3 === void 0 ? void 0 : (_response$hits2$hits$4 = _response$hits2$hits$3.ccr) === null || _response$hits2$hits$4 === void 0 ? void 0 : _response$hits2$hits$4.available) !== null && _response$hits$hits$6 !== void 0 ? _response$hits$hits$6 : undefined;
  return isEnabled && isAvailable;
}

async function checkCcrEnabled(req, esIndexPattern) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in getNodes');

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const clusterUuid = req.params.clusterUuid;

  const metricFields = _metrics.ElasticsearchMetric.getMetricFields();

  const params = {
    index: esIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        type: 'cluster_stats',
        start,
        end,
        clusterUuid,
        metric: metricFields
      }),
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }]
    },
    filterPath: ['hits.hits._source.stack_stats.xpack.ccr']
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return handleResponse(response);
}