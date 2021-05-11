"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableElasticsearchInternalCollectionRoute = disableElasticsearchInternalCollectionRoute;

var _configSchema = require("@kbn/config-schema");

var _verify_monitoring_auth = require("../../../../lib/elasticsearch/verify_monitoring_auth");

var _errors = require("../../../../lib/errors");

var _collection_disabled = require("../../../../lib/elasticsearch_settings/set/collection_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function disableElasticsearchInternalCollectionRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/setup/collection/{clusterUuid}/disable_internal_collection',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
        })
      }
    },
    handler: async req => {
      // NOTE using try/catch because checkMonitoringAuth is expected to throw
      // an error when current logged-in user doesn't have permission to read
      // the monitoring data. `try/catch` makes it a little more explicit.
      try {
        await (0, _verify_monitoring_auth.verifyMonitoringAuth)(req);
        await (0, _collection_disabled.setCollectionDisabled)(req);
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }

      return null;
    }
  });
}