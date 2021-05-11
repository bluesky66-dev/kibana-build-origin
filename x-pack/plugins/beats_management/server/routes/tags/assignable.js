"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAssignableTagsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _security = require("../../../common/constants/security");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerAssignableTagsRoute = router => {
  router.get({
    path: '/api/beats/tags/assignable/{beatIds}',
    validate: {
      params: _configSchema.schema.object({
        beatIds: _configSchema.schema.string()
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const beatIds = request.params.beatIds.split(',').filter(id => id.length > 0);
    const beats = await beatsManagement.beats.getByIds(user, beatIds);
    const tags = await beatsManagement.tags.getNonConflictingTags(user, (0, _lodash.flatten)(beats.map(beat => beat.tags)));
    return response.ok({
      body: {
        items: tags,
        success: true
      }
    });
  }));
};

exports.registerAssignableTagsRoute = registerAssignableTagsRoute;