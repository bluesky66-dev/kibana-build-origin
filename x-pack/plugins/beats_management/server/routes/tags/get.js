"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetTagsWithIdsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _security = require("../../../common/constants/security");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerGetTagsWithIdsRoute = router => {
  router.get({
    path: '/api/beats/tags/{tagIds}',
    validate: {
      params: _configSchema.schema.object({
        tagIds: _configSchema.schema.string()
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const tagIds = request.params.tagIds.split(',').filter(id => id.length > 0);
    const tags = await beatsManagement.tags.getWithIds(user, tagIds);
    return response.ok({
      body: {
        items: tags,
        success: true
      }
    });
  }));
};

exports.registerGetTagsWithIdsRoute = registerGetTagsWithIdsRoute;