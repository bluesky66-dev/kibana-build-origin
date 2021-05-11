"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTagRemovalsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _security = require("../../../common/constants/security");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerTagRemovalsRoute = router => {
  // TODO: write to Kibana audit log file https://github.com/elastic/kibana/issues/26024
  router.post({
    path: '/api/beats/agents_tags/removals',
    validate: {
      body: _configSchema.schema.object({
        removals: _configSchema.schema.arrayOf(_configSchema.schema.object({
          beatId: _configSchema.schema.string(),
          tag: _configSchema.schema.string()
        }), {
          defaultValue: []
        })
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const {
      removals
    } = request.body;
    const result = await beatsManagement.beats.removeTagsFromBeats(user, removals);
    return response.ok({
      body: {
        success: true,
        results: result.removals.map(removal => ({
          success: removal.status && removal.status >= 200 && removal.status < 300,
          error: !removal.status || removal.status >= 300 ? {
            code: removal.status || 400,
            message: removal.result
          } : undefined,
          result: removal.status && removal.status >= 200 && removal.status < 300 ? {
            message: removal.result
          } : undefined
        }))
      }
    });
  }));
};

exports.registerTagRemovalsRoute = registerTagRemovalsRoute;