"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateApiKeyRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _license_api_access = require("../lib/license_api_access");

var _common = require("../../common");

var _error_handler = require("./lib/error_handler");

var _alert_type_disabled = require("../lib/errors/alert_type_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

const updateApiKeyRoute = (router, licenseState) => {
  router.post({
    path: `${_common.BASE_ALERT_API_PATH}/alert/{id}/_update_api_key`,
    validate: {
      params: paramSchema
    }
  }, (0, _error_handler.handleDisabledApiKeysError)(router.handleLegacyErrors(async function (context, req, res) {
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

    try {
      await alertsClient.updateApiKey({
        id
      });
      return res.noContent();
    } catch (e) {
      if (e instanceof _alert_type_disabled.AlertTypeDisabledError) {
        return e.sendResponse(res);
      }

      throw e;
    }
  })));
};

exports.updateApiKeyRoute = updateApiKeyRoute;