"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterLicense = getClusterLicense;

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _metrics = require("../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore


function getClusterLicense(req, esIndexPattern, clusterUuid) {
  (0, _error_missing_required.checkParam)(esIndexPattern, 'esIndexPattern in getClusterLicense');
  const params = {
    index: esIndexPattern,
    size: 1,
    ignoreUnavailable: true,
    filterPath: 'hits.hits._source.license',
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type: 'cluster_stats',
        clusterUuid,
        metric: _metrics.ElasticsearchMetric.getMetricFields()
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(response => {
    var _response$hits, _response$hits$hits$;

    return (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : (_response$hits$hits$ = _response$hits.hits[0]) === null || _response$hits$hits$ === void 0 ? void 0 : _response$hits$hits$._source.license;
  });
}