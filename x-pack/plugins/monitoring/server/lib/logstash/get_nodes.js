"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodes = getNodes;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("../error_missing_required");

var _create_query = require("../create_query");

var _calculate_availability = require("../calculate_availability");

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

/*
 * Get detailed info for Logstash's in the cluster
 * for Logstash nodes listing page
 * For each instance:
 *  - name
 *  - status
 *  - JVM memory
 *  - os load average
 *  - events
 *  - config reloads
 */


function getNodes(req, lsIndexPattern, {
  clusterUuid
}) {
  (0, _error_missing_required.checkParam)(lsIndexPattern, 'lsIndexPattern in getNodes');
  const config = req.server.config();

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const params = {
    index: lsIndexPattern,
    size: config.get('monitoring.ui.max_bucket_size'),
    // FIXME
    ignoreUnavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        start,
        end,
        clusterUuid,
        metric: _metrics.LogstashMetric.getMetricFields(),
        type: 'logstash_stats'
      }),
      collapse: {
        field: 'logstash_stats.logstash.uuid'
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      _source: ['timestamp', 'logstash_stats.process.cpu.percent', 'logstash_stats.jvm.mem.heap_used_percent', 'logstash_stats.os.cpu.load_average.1m', 'logstash_stats.events.out', 'logstash_stats.logstash.http_address', 'logstash_stats.logstash.name', 'logstash_stats.logstash.host', 'logstash_stats.logstash.uuid', 'logstash_stats.logstash.status', 'logstash_stats.logstash.pipeline', 'logstash_stats.reloads', 'logstash_stats.logstash.version']
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(resp => {
    const instances = (0, _lodash.get)(resp, 'hits.hits', []);
    return instances.map(hit => {
      return { ...(0, _lodash.get)(hit, '_source.logstash_stats'),
        availability: (0, _calculate_availability.calculateAvailability)((0, _lodash.get)(hit, '_source.timestamp'))
      };
    });
  });
}