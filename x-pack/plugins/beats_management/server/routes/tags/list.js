"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListTagsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _security = require("../../../common/constants/security");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerListTagsRoute = router => {
  router.get({
    path: '/api/beats/tags',
    validate: {
      query: _configSchema.schema.object({
        ESQuery: _configSchema.schema.maybe(_configSchema.schema.string())
      }, {
        defaultValue: {}
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const tags = await beatsManagement.tags.getAll(user, request.query && request.query.ESQuery ? JSON.parse(request.query.ESQuery) : undefined);
    return response.ok({
      body: {
        list: tags,
        success: true,
        page: -1,
        total: -1
      }
    });
  }));
};

exports.registerListTagsRoute = registerListTagsRoute;