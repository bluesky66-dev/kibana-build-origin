"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogstashPipelineIds = getLogstashPipelineIds;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _create_query = require("../create_query");

var _metrics = require("../metrics");

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


async function getLogstashPipelineIds(req, logstashIndexPattern, {
  clusterUuid,
  logstashUuid
}, size) {
  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const filters = [];

  if (logstashUuid) {
    filters.push({
      term: {
        'logstash_stats.logstash.uuid': logstashUuid
      }
    });
  }

  const params = {
    index: logstashIndexPattern,
    size: 0,
    ignoreUnavailable: true,
    filterPath: ['aggregations.nest.id.buckets'],
    body: {
      query: (0, _create_query.createQuery)({
        start,
        end,
        metric: _metrics.LogstashMetric.getMetricFields(),
        clusterUuid,
        filters
      }),
      aggs: {
        nest: {
          nested: {
            path: 'logstash_stats.pipelines'
          },
          aggs: {
            id: {
              terms: {
                field: 'logstash_stats.pipelines.id',
                size
              },
              aggs: {
                unnest: {
                  reverse_nested: {},
                  aggs: {
                    nodes: {
                      terms: {
                        field: 'logstash_stats.logstash.uuid',
                        size
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return (0, _lodash.get)(response, 'aggregations.nest.id.buckets', []).map(bucket => ({
    id: bucket.key,
    nodeIds: (0, _lodash.get)(bucket, 'unnest.nodes.buckets', []).map(item => item.key)
  }));
}