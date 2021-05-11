"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetApiKeysRoutes = defineGetApiKeysRoutes;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineGetApiKeysRoutes({
  router
}) {
  router.get({
    path: '/internal/security/api_key',
    validate: {
      query: _configSchema.schema.object({
        // We don't use `schema.boolean` here, because all query string parameters are treated as
        // strings and @kbn/config-schema doesn't coerce strings to booleans.
        //
        // A boolean flag that can be used to query API keys owned by the currently authenticated
        // user. `false` means that only API keys of currently authenticated user will be returned.
        isAdmin: _configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')])
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const isAdmin = request.query.isAdmin === 'true';
      const apiResponse = await context.core.elasticsearch.client.asCurrentUser.security.getApiKey({
        owner: !isAdmin
      });
      const validKeys = apiResponse.body.api_keys.filter(({
        invalidated
      }) => !invalidated);
      return response.ok({
        body: {
          apiKeys: validKeys
        }
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}