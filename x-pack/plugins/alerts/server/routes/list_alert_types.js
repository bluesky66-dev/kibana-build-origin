"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listAlertTypesRoute = void 0;

var _license_api_access = require("../lib/license_api_access");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const listAlertTypesRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ALERT_API_PATH}/list_alert_types`,
    validate: {}
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    return res.ok({
      body: Array.from(await context.alerting.getAlertsClient().listAlertTypes())
    });
  }));
};

exports.listAlertTypesRoute = listAlertTypesRoute;