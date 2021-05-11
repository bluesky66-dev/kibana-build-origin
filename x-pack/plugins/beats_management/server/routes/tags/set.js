"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSetTagRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerSetTagRoute = router => {
  // TODO: write to Kibana audit log file
  router.put({
    path: '/api/beats/tag/{tagId}',
    validate: {
      params: _configSchema.schema.object({
        tagId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        color: _configSchema.schema.maybe(_configSchema.schema.string()),
        name: _configSchema.schema.maybe(_configSchema.schema.string())
      }, {
        defaultValue: {}
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _constants.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const config = {
      id: request.params.tagId,
      name: request.params.tagId,
      color: '#DD0A73',
      hasConfigurationBlocksTypes: [],
      ...request.body
    };
    const id = await beatsManagement.tags.upsertTag(user, config);
    const tag = await beatsManagement.tags.getWithIds(user, [id]); // TODO the action needs to be surfaced

    return response.ok({
      body: {
        success: true,
        item: tag[0],
        action: 'created'
      }
    });
  }));
};

exports.registerSetTagRoute = registerSetTagRoute;