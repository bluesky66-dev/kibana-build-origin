"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteConfigurationBlocksRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _wrap_route_with_security = require("../wrap_route_with_security");

var _security = require("../../../common/constants/security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDeleteConfigurationBlocksRoute = router => {
  router.delete({
    path: '/api/beats/configurations/{ids}',
    validate: {
      params: _configSchema.schema.object({
        ids: _configSchema.schema.string()
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const ids = request.params.ids.split(',').filter(id => id.length > 0);
    const user = beatsManagement.framework.getUser(request);
    const results = await beatsManagement.configurationBlocks.delete(user, ids);
    return response.ok({
      body: {
        success: true,
        results: results.map(result => ({
          success: result.success,
          action: 'deleted',
          error: result.success ? undefined : {
            message: result.reason
          }
        }))
      }
    });
  }));
};

exports.registerDeleteConfigurationBlocksRoute = registerDeleteConfigurationBlocksRoute;