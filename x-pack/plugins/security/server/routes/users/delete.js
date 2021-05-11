"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineDeleteUserRoutes = defineDeleteUserRoutes;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineDeleteUserRoutes({
  router
}) {
  router.delete({
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
      await context.core.elasticsearch.client.asCurrentUser.security.deleteUser({
        username: request.params.username
      });
      return response.noContent();
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}