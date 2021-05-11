"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmInstanceRoute = apmInstanceRoute;

var _configSchema = require("@kbn/config-schema");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _metric_set_instance = require("./metric_set_instance");

var _errors = require("../../../../lib/errors");

var _apm = require("../../../../lib/apm");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function apmInstanceRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/apm/{apmUuid}',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string(),
          apmUuid: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          })
        })
      }
    },

    async handler(req) {
      const apmUuid = req.params.apmUuid;
      const config = server.config();
      const clusterUuid = req.params.clusterUuid;
      const ccs = req.payload.ccs;
      const apmIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);

      try {
        const [metrics, apmSummary] = await Promise.all([(0, _get_metrics.getMetrics)(req, apmIndexPattern, _metric_set_instance.metricSet, [{
          term: {
            'beats_stats.beat.uuid': apmUuid
          }
        }]), (0, _apm.getApmInfo)(req, apmIndexPattern, {
          clusterUuid,
          apmUuid
        })]);
        return {
          metrics,
          apmSummary
        };
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
    }

  });
}