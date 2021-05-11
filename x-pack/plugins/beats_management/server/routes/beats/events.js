"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBeatEventsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerBeatEventsRoute = router => {
  router.post({
    path: '/api/beats/{beatId}/events',
    validate: {
      params: _configSchema.schema.object({
        beatId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.arrayOf(_configSchema.schema.any(), {
        defaultValue: []
      })
    },
    options: {
      authRequired: false
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({}, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const accessToken = request.headers['kbn-beats-access-token'];

    if (!accessToken) {
      return response.badRequest({
        body: 'beats access token required'
      });
    }

    const beatId = request.params.beatId;
    const events = request.body;
    const internalUser = beatsManagement.framework.internalUser;
    const beat = await beatsManagement.beats.getById(internalUser, beatId);

    if (beat === null) {
      return response.badRequest({
        body: {
          message: `Beat "${beatId}" not found`
        }
      });
    }

    const isAccessTokenValid = beat.access_token === accessToken;

    if (!isAccessTokenValid) {
      return response.unauthorized({
        body: {
          message: `Invalid access token`
        }
      });
    }

    const results = await beatsManagement.beatEvents.log(internalUser, beat.id, events);
    return response.ok({
      body: {
        results,
        success: true
      }
    });
  }));
};

exports.registerBeatEventsRoute = registerBeatEventsRoute;