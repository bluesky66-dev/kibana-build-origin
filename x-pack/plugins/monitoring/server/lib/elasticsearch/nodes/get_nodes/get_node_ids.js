"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodeIds = getNodeIds;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _metrics = require("../../../metrics");

var _create_query = require("../../../create_query");

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


async function getNodeIds(req, indexPattern, {
  clusterUuid
}, size) {
  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const params = {
    index: indexPattern,
    size: 0,
    ignoreUnavailable: true,
    filterPath: ['aggregations.composite_data.buckets'],
    body: {
      query: (0, _create_query.createQuery)({
        type: 'node_stats',
        start,
        end,
        metric: _metrics.ElasticsearchMetric.getMetricFields(),
        clusterUuid
      }),
      aggs: {
        composite_data: {
          composite: {
            size,
            sources: [{
              name: {
                terms: {
                  field: 'source_node.name'
                }
              }
            }, {
              uuid: {
                terms: {
                  field: 'source_node.uuid'
                }
              }
            }]
          }
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return (0, _lodash.get)(response, 'aggregations.composite_data.buckets', []).map(bucket => bucket.key);
}