"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAccessRoute = checkAccessRoute;

var _verify_monitoring_auth = require("../../../../lib/elasticsearch/verify_monitoring_auth");

var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * API for checking read privilege on Monitoring Data
 * Used for the "Access Denied" page as something to auto-retry with.
 */


function checkAccessRoute(server) {
  server.route({
    method: 'GET',
    path: '/api/monitoring/v1/check_access',
    handler: async req => {
      const response = {};

      try {
        await (0, _verify_monitoring_auth.verifyMonitoringAuth)(req);
        response.has_access = true; // response data is ignored
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }

      return response;
    }
  });
}