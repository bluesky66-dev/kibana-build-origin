"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clusterSettingsCheckRoute = clusterSettingsCheckRoute;

var _elasticsearch_settings = require("../../../../../lib/elasticsearch_settings");

var _errors = require("../../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Cluster Settings Check Route
 */


function clusterSettingsCheckRoute(server) {
  server.route({
    method: 'GET',
    path: '/api/monitoring/v1/elasticsearch_settings/check/cluster',
    config: {
      validate: {}
    },

    async handler(req) {
      try {
        const response = await (0, _elasticsearch_settings.checkClusterSettings)(req); // needs to be try/catch to handle privilege error

        return response;
      } catch (err) {
        throw (0, _errors.handleSettingsError)(err);
      }
    }

  });
}