"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetBeatRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerGetBeatRoute = router => {
  router.get({
    path: '/api/beats/agent/{beatId}/{token?}',
    validate: {
      params: _configSchema.schema.object({
        beatId: _configSchema.schema.string(),
        token: _configSchema.schema.string({
          defaultValue: ''
        })
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const beatId = request.params.beatId;
    let beat;

    if (beatId === 'unknown') {
      beat = await beatsManagement.beats.getByEnrollmentToken(user, request.params.token);

      if (beat === null) {
        return response.ok({
          body: {
            success: false
          }
        });
      }
    } else {
      beat = await beatsManagement.beats.getById(user, beatId);

      if (beat === null) {
        return response.notFound({
          body: {
            message: 'Beat not found'
          }
        });
      }
    }

    delete beat.access_token;
    return response.ok({
      body: {
        item: beat,
        success: true
      }
    });
  }));
};

exports.registerGetBeatRoute = registerGetBeatRoute;