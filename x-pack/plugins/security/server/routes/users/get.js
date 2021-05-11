"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetUserRoutes = defineGetUserRoutes;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineGetUserRoutes({
  router
}) {
  router.get({
    path: '/internal/security/users/{username}',
    validate: {
      params: _configSchema.schema.object({
        username: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1024
        })
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const username = request.params.username;
      const {
        body: users
      } = await context.core.elasticsearch.client.asCurrentUser.security.getUser({
        username
      });

      if (!users[username]) {
        return response.notFound();
      }

      return response.ok({
        body: users[username]
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}