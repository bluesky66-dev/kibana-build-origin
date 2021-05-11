"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clustersRoute = clustersRoute;

var _configSchema = require("@kbn/config-schema");

var _get_clusters_from_request = require("../../../../lib/cluster/get_clusters_from_request");

var _verify_monitoring_auth = require("../../../../lib/elasticsearch/verify_monitoring_auth");

var _errors = require("../../../../lib/errors");

var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function clustersRoute(server) {
  /*
   * Monitoring Home
   * Route Init (for checking license and compatibility for multi-cluster monitoring
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters',
    config: {
      validate: {
        body: _configSchema.schema.object({
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          }),
          codePaths: _configSchema.schema.arrayOf(_configSchema.schema.string())
        })
      }
    },
    handler: async req => {
      let clusters = [];
      const config = server.config(); // NOTE using try/catch because checkMonitoringAuth is expected to throw
      // an error when current logged-in user doesn't have permission to read
      // the monitoring data. `try/catch` makes it a little more explicit.

      try {
        await (0, _verify_monitoring_auth.verifyMonitoringAuth)(req);
        const indexPatterns = (0, _get_index_patterns.getIndexPatterns)(server, {
          filebeatIndexPattern: config.get('monitoring.ui.logs.index')
        });
        clusters = await (0, _get_clusters_from_request.getClustersFromRequest)(req, indexPatterns, {
          codePaths: req.payload.codePaths
        });
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }

      return clusters;
    }
  });
}