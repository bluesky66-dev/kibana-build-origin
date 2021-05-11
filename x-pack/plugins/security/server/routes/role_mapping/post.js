"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoleMappingPostRoutes = defineRoleMappingPostRoutes;

var _configSchema = require("@kbn/config-schema");

var _licensed_route_handler = require("../licensed_route_handler");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defineRoleMappingPostRoutes({
  router
}) {
  router.post({
    path: '/internal/security/role_mapping/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        roles: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
          defaultValue: []
        }),
        role_templates: _configSchema.schema.arrayOf(_configSchema.schema.object({
          // Not validating `template` because the ES API currently accepts invalid payloads here.
          // We allow this as well so that existing mappings can be updated via our Role Management UI
          template: _configSchema.schema.any(),
          format: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('string'), _configSchema.schema.literal('json')]))
        }), {
          defaultValue: []
        }),
        enabled: _configSchema.schema.boolean(),
        // Also lax on validation here because the real rules get quite complex,
        // and keeping this in sync (and testable!) with ES could prove problematic.
        // We do not interpret any of these rules within this route handler;
        // they are simply passed to ES for processing.
        rules: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        metadata: _configSchema.schema.object({}, {
          unknowns: 'allow'
        })
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const saveResponse = await context.core.elasticsearch.client.asCurrentUser.security.putRoleMapping({
        name: request.params.name,
        body: request.body
      });
      return response.ok({
        body: saveResponse.body
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