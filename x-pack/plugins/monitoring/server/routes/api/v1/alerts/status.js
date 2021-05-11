"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertStatusRoute = alertStatusRoute;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../../../lib/errors");

var _fetch_status = require("../../../../lib/alerts/fetch_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


function alertStatusRoute(server, npRoute) {
  npRoute.router.post({
    path: '/api/monitoring/v1/alert/{clusterUuid}/status',
    validate: {
      params: _configSchema.schema.object({
        clusterUuid: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        alertTypeIds: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.any())),
        timeRange: _configSchema.schema.object({
          min: _configSchema.schema.number(),
          max: _configSchema.schema.number()
        })
      })
    }
  }, async (context, request, response) => {
    try {
      var _context$alerting;

      const {
        clusterUuid
      } = request.params;
      const {
        alertTypeIds,
        filters
      } = request.body;
      const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();

      if (!alertsClient) {
        return response.ok({
          body: undefined
        });
      }

      const status = await (0, _fetch_status.fetchStatus)(alertsClient, npRoute.licenseService, alertTypeIds, [clusterUuid], filters);
      return response.ok({
        body: status
      });
    } catch (err) {
      throw (0, _errors.handleError)(err);
    }
  });
}