"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertingRoutes = alertingRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _alerting_service = require("../lib/alerts/alerting_service");

var _alerting_schema = require("./schemas/alerting_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function alertingRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup Alerting
   *
   * @api {post} /api/ml/alerting/preview Preview alerting condition
   * @apiName PreviewAlert
   * @apiDescription Returns a preview of the alerting condition
   *
   * @apiSchema (body) mlAnomalyDetectionAlertPreviewRequest
   */
  router.post({
    path: '/api/ml/alerting/preview',
    validate: {
      body: _alerting_schema.mlAnomalyDetectionAlertPreviewRequest
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    mlClient,
    request,
    response,
    client
  }) => {
    try {
      const alertingService = (0, _alerting_service.alertingServiceProvider)(mlClient, client.asInternalUser);
      const result = await alertingService.preview(request.body);
      return response.ok({
        body: result
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}