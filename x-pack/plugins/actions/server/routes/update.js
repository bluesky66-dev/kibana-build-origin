"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateActionRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

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

const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  config: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  secrets: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  })
});

const updateActionRoute = (router, licenseState) => {
  router.put({
    path: `${_common.BASE_ACTION_API_PATH}/action/{id}`,
    validate: {
      body: bodySchema,
      params: paramSchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _lib.verifyApiAccess)(licenseState);

    if (!context.actions) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for actions'
      });
    }

    const actionsClient = context.actions.getActionsClient();
    const {
      id
    } = req.params;
    const {
      name,
      config,
      secrets
    } = req.body;

    try {
      return res.ok({
        body: await actionsClient.update({
          id,
          action: {
            name,
            config,
            secrets
          }
        })
      });
    } catch (e) {
      if ((0, _lib.isErrorThatHandlesItsOwnResponse)(e)) {
        return e.sendResponse(res);
      }

      throw e;
    }
  }));
};

exports.updateActionRoute = updateActionRoute;