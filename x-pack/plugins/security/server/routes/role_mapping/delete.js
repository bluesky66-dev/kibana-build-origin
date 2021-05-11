"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoleMappingDeleteRoutes = defineRoleMappingDeleteRoutes;

var _configSchema = require("@kbn/config-schema");

var _licensed_route_handler = require("../licensed_route_handler");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoleMappingDeleteRoutes({
  router
}) {
  router.delete({
    path: '/internal/security/role_mapping/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const {
        body: deleteResponse
      } = await context.core.elasticsearch.client.asCurrentUser.security.deleteRoleMapping({
        name: request.params.name
      });
      return response.ok({
        body: deleteResponse
      });
    } catch (error) {
      const wrappedError = (0, _errors.wrapError)(error);
      return response.customError({
        body: wrappedError,
        statusCode: wrappedError.output.statusCode
      });
    }
  }));
}