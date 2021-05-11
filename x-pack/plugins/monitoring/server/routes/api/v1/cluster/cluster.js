"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clusterRoute = clusterRoute;

var _configSchema = require("@kbn/config-schema");

var _get_clusters_from_request = require("../../../../lib/cluster/get_clusters_from_request");

var _errors = require("../../../../lib/errors");

var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function clusterRoute(server) {
  /*
   * Cluster Overview
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}',
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
          }),
          codePaths: _configSchema.schema.arrayOf(_configSchema.schema.string())
        })
      }
    },
    handler: async req => {
      const config = server.config();
      const indexPatterns = (0, _get_index_patterns.getIndexPatterns)(server, {
        filebeatIndexPattern: config.get('monitoring.ui.logs.index')
      });
      const options = {
        clusterUuid: req.params.clusterUuid,
        start: req.payload.timeRange.min,
        end: req.payload.timeRange.max,
        codePaths: req.payload.codePaths
      };
      let clusters = [];

      try {
        clusters = await (0, _get_clusters_from_request.getClustersFromRequest)(req, indexPatterns, options);
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }

      return clusters;
    }
  });
}