"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeSetupStatusRoute = nodeSetupStatusRoute;

var _configSchema = require("@kbn/config-schema");

var _verify_monitoring_auth = require("../../../../lib/elasticsearch/verify_monitoring_auth");

var _errors = require("../../../../lib/errors");

var _collection = require("../../../../lib/setup/collection");

var _get_index_patterns = require("../../../../lib/cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function nodeSetupStatusRoute(server) {
  /*
   * Monitoring Home
   * Route Init (for checking license and compatibility for multi-cluster monitoring
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/setup/collection/node/{nodeUuid}',
    config: {
      validate: {
        params: _configSchema.schema.object({
          nodeUuid: _configSchema.schema.string()
        }),
        query: _configSchema.schema.object({
          // This flag is not intended to be used in production. It was introduced
          // as a way to ensure consistent API testing - the typical data source
          // for API tests are archived data, where the cluster configuration and data
          // are consistent from environment to environment. However, this endpoint
          // also attempts to retrieve data from the running stack products (ES and Kibana)
          // which will vary from environment to environment making it difficult
          // to write tests against. Therefore, this flag exists and should only be used
          // in our testing environment.
          skipLiveData: _configSchema.schema.boolean({
            defaultValue: false
          })
        }),
        payload: _configSchema.schema.nullable(_configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.maybe(_configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          }))
        }))
      }
    },
    handler: async req => {
      let status = null; // NOTE using try/catch because checkMonitoringAuth is expected to throw
      // an error when current logged-in user doesn't have permission to read
      // the monitoring data. `try/catch` makes it a little more explicit.

      try {
        await (0, _verify_monitoring_auth.verifyMonitoringAuth)(req);
        const indexPatterns = (0, _get_index_patterns.getIndexPatterns)(server, {}, req.payload.ccs);
        status = await (0, _collection.getCollectionStatus)(req, indexPatterns, null, req.params.nodeUuid, req.query.skipLiveData);
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }

      return status;
    }
  });
}