"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmOverviewRoute = apmOverviewRoute;

var _configSchema = require("@kbn/config-schema");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _metric_set_overview = require("./metric_set_overview");

var _errors = require("../../../../lib/errors");

var _get_apm_cluster_status = require("./_get_apm_cluster_status");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function apmOverviewRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/apm',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
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
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const apmIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);

      try {
        const [stats, metrics] = await Promise.all([(0, _get_apm_cluster_status.getApmClusterStatus)(req, apmIndexPattern, {
          clusterUuid
        }), (0, _get_metrics.getMetrics)(req, apmIndexPattern, _metric_set_overview.metricSet)]);
        return {
          stats,
          metrics
        };
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
    }

  });
}