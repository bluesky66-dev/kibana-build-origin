"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanas = getKibanas;

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
 * Get detailed info for Kibanas in the cluster
 * for Kibana listing page
 * For each instance:
 *  - name
 *  - status
 *  - memory
 *  - os load average
 *  - requests
 *  - response times
 */


function getKibanas(req, kbnIndexPattern, {
  clusterUuid
}) {
  (0, _error_missing_required.checkParam)(kbnIndexPattern, 'kbnIndexPattern in getKibanas');
  const config = req.server.config();

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const params = {
    index: kbnIndexPattern,
    size: config.get('monitoring.ui.max_bucket_size'),
    ignoreUnavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        type: 'kibana_stats',
        start,
        end,
        clusterUuid,
        metric: _metrics.KibanaMetric.getMetricFields()
      }),
      collapse: {
        field: 'kibana_stats.kibana.uuid'
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      _source: ['timestamp', 'kibana_stats.process.memory.resident_set_size_in_bytes', 'kibana_stats.os.load.1m', 'kibana_stats.response_times.average', 'kibana_stats.response_times.max', 'kibana_stats.requests.total', 'kibana_stats.kibana.transport_address', 'kibana_stats.kibana.name', 'kibana_stats.kibana.host', 'kibana_stats.kibana.uuid', 'kibana_stats.kibana.status', 'kibana_stats.concurrent_connections']
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(resp => {
    const instances = (0, _lodash.get)(resp, 'hits.hits', []);
    return instances.map(hit => {
      return { ...(0, _lodash.get)(hit, '_source.kibana_stats'),
        availability: (0, _calculate_availability.calculateAvailability)((0, _lodash.get)(hit, '_source.timestamp'))
      };
    });
  });
}