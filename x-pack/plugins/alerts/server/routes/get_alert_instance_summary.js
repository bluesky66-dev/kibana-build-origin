"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertInstanceSummaryRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _license_api_access = require("../lib/license_api_access");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

const querySchema = _configSchema.schema.object({
  dateStart: _configSchema.schema.maybe(_configSchema.schema.string())
});

const getAlertInstanceSummaryRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ALERT_API_PATH}/alert/{id}/_instance_summary`,
    validate: {
      params: paramSchema,
      query: querySchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    const alertsClient = context.alerting.getAlertsClient();
    const {
      id
    } = req.params;
    const {
      dateStart
    } = req.query;
    const summary = await alertsClient.getAlertInstanceSummary({
      id,
      dateStart
    });
    return res.ok({
      body: summary
    });
  }));
};

exports.getAlertInstanceSummaryRoute = getAlertInstanceSummaryRoute;