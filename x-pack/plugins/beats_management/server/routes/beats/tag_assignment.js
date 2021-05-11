"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTagAssignmentsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _security = require("../../../common/constants/security");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerTagAssignmentsRoute = router => {
  // TODO: write to Kibana audit log file https://github.com/elastic/kibana/issues/26024
  router.post({
    path: '/api/beats/agents_tags/assignments',
    validate: {
      body: _configSchema.schema.object({
        assignments: _configSchema.schema.arrayOf(_configSchema.schema.object({
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
      assignments
    } = request.body;
    const result = await beatsManagement.beats.assignTagsToBeats(user, assignments);
    return response.ok({
      body: {
        success: true,
        results: result.assignments.map(assignment => ({
          success: assignment.status && assignment.status >= 200 && assignment.status < 300,
          error: !assignment.status || assignment.status >= 300 ? {
            code: assignment.status || 400,
            message: assignment.result
          } : undefined,
          result: assignment.status && assignment.status >= 200 && assignment.status < 300 ? {
            message: assignment.result
          } : undefined
        }))
      }
    });
  }));
};

exports.registerTagAssignmentsRoute = registerTagAssignmentsRoute;