"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashNodesRoute = logstashNodesRoute;

var _configSchema = require("@kbn/config-schema");

var _get_cluster_status = require("../../../../lib/logstash/get_cluster_status");

var _get_nodes = require("../../../../lib/logstash/get_nodes");

var _errors = require("../../../../lib/errors");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Logstash Nodes route.
 */


function logstashNodesRoute(server) {
  /**
   * Logstash Nodes request.
   *
   * This will fetch all data required to display the Logstash Nodes page.
   *
   * The current details returned are:
   *
   * - Logstash Cluster Status
   * - Nodes list
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/nodes',
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
      const lsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_LOGSTASH, ccs);

      try {
        const [clusterStatus, nodes] = await Promise.all([(0, _get_cluster_status.getClusterStatus)(req, lsIndexPattern, {
          clusterUuid
        }), (0, _get_nodes.getNodes)(req, lsIndexPattern, {
          clusterUuid
        })]);
        return {
          clusterStatus,
          nodes
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}