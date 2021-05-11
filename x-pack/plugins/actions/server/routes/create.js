"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionRoute = exports.bodySchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  actionTypeId: _configSchema.schema.string(),
  config: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  secrets: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  })
});

exports.bodySchema = bodySchema;

const createActionRoute = (router, licenseState) => {
  router.post({
    path: `${_common.BASE_ACTION_API_PATH}/action`,
    validate: {
      body: bodySchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _lib.verifyApiAccess)(licenseState);

    if (!context.actions) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for actions'
      });
    }

    const actionsClient = context.actions.getActionsClient();
    const action = req.body;

    try {
      const actionRes = await actionsClient.create({
        action
      });
      return res.ok({
        body: actionRes
      });
    } catch (e) {
      if ((0, _lib.isErrorThatHandlesItsOwnResponse)(e)) {
        return e.sendResponse(res);
      }

      throw e;
    }
  }));
};

exports.createActionRoute = createActionRoute;