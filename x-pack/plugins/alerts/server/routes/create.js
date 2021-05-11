"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertRoute = exports.bodySchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _license_api_access = require("../lib/license_api_access");

var _lib = require("../lib");

var _error_handler = require("./lib/error_handler");

var _types = require("../types");

var _alert_type_disabled = require("../lib/errors/alert_type_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  alertTypeId: _configSchema.schema.string(),
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  consumer: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  throttle: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _lib.validateDurationSchema
  })),
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  schedule: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema
    })
  }),
  actions: _configSchema.schema.arrayOf(_configSchema.schema.object({
    group: _configSchema.schema.string(),
    id: _configSchema.schema.string(),
    actionTypeId: _configSchema.schema.maybe(_configSchema.schema.string()),
    params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
      defaultValue: {}
    })
  }), {
    defaultValue: []
  }),
  notifyWhen: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _types.validateNotifyWhenType
  }))
});

exports.bodySchema = bodySchema;

const createAlertRoute = (router, licenseState) => {
  router.post({
    path: `${_types.BASE_ALERT_API_PATH}/alert/{id?}`,
    validate: {
      params: _configSchema.schema.maybe(_configSchema.schema.object({
        id: _configSchema.schema.maybe(_configSchema.schema.string())
      })),
      body: bodySchema
    }
  }, (0, _error_handler.handleDisabledApiKeysError)(router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    const alertsClient = context.alerting.getAlertsClient();
    const alert = req.body;
    const params = req.params;
    const notifyWhen = alert !== null && alert !== void 0 && alert.notifyWhen ? alert.notifyWhen : null;

    try {
      const alertRes = await alertsClient.create({
        data: { ...alert,
          notifyWhen
        },
        options: {
          id: params === null || params === void 0 ? void 0 : params.id
        }
      });
      return res.ok({
        body: alertRes
      });
    } catch (e) {
      if (e instanceof _alert_type_disabled.AlertTypeDisabledError) {
        return e.sendResponse(res);
      }

      throw e;
    }
  })));
};

exports.createAlertRoute = createAlertRoute;