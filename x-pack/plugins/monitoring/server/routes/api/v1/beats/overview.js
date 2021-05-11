"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beatsOverviewRoute = beatsOverviewRoute;

var _configSchema = require("@kbn/config-schema");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _beats = require("../../../../lib/beats");

var _errors = require("../../../../lib/errors");

var _metric_set_overview = require("./metric_set_overview");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function beatsOverviewRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/beats',
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
      const beatsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);

      try {
        const [latest, stats, metrics] = await Promise.all([(0, _beats.getLatestStats)(req, beatsIndexPattern, clusterUuid), (0, _beats.getStats)(req, beatsIndexPattern, clusterUuid), (0, _get_metrics.getMetrics)(req, beatsIndexPattern, _metric_set_overview.metricSet)]);
        return { ...latest,
          stats,
          metrics
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}