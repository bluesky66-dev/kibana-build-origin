"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetConfigurationBlocksRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _wrap_route_with_security = require("../wrap_route_with_security");

var _security = require("../../../common/constants/security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerGetConfigurationBlocksRoute = router => {
  router.get({
    path: '/api/beats/configurations/{tagIds}/{page?}',
    validate: {
      params: _configSchema.schema.object({
        tagIds: _configSchema.schema.string(),
        page: _configSchema.schema.maybe(_configSchema.schema.number())
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const tagIds = request.params.tagIds.split(',').filter(id => id.length > 0);
    const user = beatsManagement.framework.getUser(request);
    const result = await beatsManagement.configurationBlocks.getForTags(user, tagIds, request.params.page, 5);
    return response.ok({
      body: {
        page: result.page,
        total: result.total,
        list: result.blocks,
        success: true
      }
    });
  }));
};

exports.registerGetConfigurationBlocksRoute = registerGetConfigurationBlocksRoute;