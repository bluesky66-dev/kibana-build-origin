"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineCreateOrUpdateUserRoutes = defineCreateOrUpdateUserRoutes;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineCreateOrUpdateUserRoutes({
  router
}) {
  router.post({
    path: '/internal/security/users/{username}',
    validate: {
      params: _configSchema.schema.object({
        username: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1024
        })
      }),
      body: _configSchema.schema.object({
        username: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1024
        }),
        password: _configSchema.schema.maybe(_configSchema.schema.string({
          minLength: 1
        })),
        roles: _configSchema.schema.arrayOf(_configSchema.schema.string({
          minLength: 1
        })),
        full_name: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal(null), _configSchema.schema.string()])),
        email: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal(null), _configSchema.schema.string()])),
        metadata: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
        enabled: _configSchema.schema.boolean({
          defaultValue: true
        })
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      await context.core.elasticsearch.client.asCurrentUser.security.putUser({
        username: request.params.username,
        body: request.body
      });
      return response.ok({
        body: request.body
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}