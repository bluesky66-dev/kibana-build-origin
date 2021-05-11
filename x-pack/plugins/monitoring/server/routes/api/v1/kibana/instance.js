"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaInstanceRoute = kibanaInstanceRoute;

var _configSchema = require("@kbn/config-schema");

var _get_kibana_info = require("../../../../lib/kibana/get_kibana_info");

var _errors = require("../../../../lib/errors");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _metric_set_instance = require("./metric_set_instance");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore

/**
 * Kibana instance: This will fetch all data required to display a Kibana
 * instance's page. The current details returned are:
 * - Kibana Instance Summary (Status)
 * - Metrics
 */


function kibanaInstanceRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/kibana/{kibanaUuid}',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string(),
          kibanaUuid: _configSchema.schema.string()
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
      const kibanaUuid = req.params.kibanaUuid;
      const kbnIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_KIBANA, ccs);

      try {
        const [metrics, kibanaSummary] = await Promise.all([(0, _get_metrics.getMetrics)(req, kbnIndexPattern, _metric_set_instance.metricSet), (0, _get_kibana_info.getKibanaInfo)(req, kbnIndexPattern, {
          clusterUuid,
          kibanaUuid
        })]);
        return {
          metrics,
          kibanaSummary
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}