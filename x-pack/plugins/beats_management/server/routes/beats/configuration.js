"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetBeatConfigurationRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerGetBeatConfigurationRoute = router => {
  router.get({
    path: '/api/beats/agent/{beatId}/configuration',
    validate: {
      params: _configSchema.schema.object({
        beatId: _configSchema.schema.string()
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
    let configurationBlocks;
    const beat = await beatsManagement.beats.getById(beatsManagement.framework.internalUser, beatId);

    if (beat === null) {
      return response.notFound({
        body: {
          message: `Beat "${beatId}" not found`
        }
      });
    }

    const isAccessTokenValid = beat.access_token === accessToken;

    if (!isAccessTokenValid) {
      return response.unauthorized({
        body: {
          message: 'Invalid access token'
        }
      });
    }

    await beatsManagement.beats.update(beatsManagement.framework.internalUser, beat.id, {
      last_checkin: new Date()
    });

    if (beat.tags) {
      const result = await beatsManagement.configurationBlocks.getForTags(beatsManagement.framework.internalUser, beat.tags, -1);
      configurationBlocks = result.blocks;
    } else {
      configurationBlocks = [];
    }

    return response.ok({
      body: {
        list: configurationBlocks,
        success: true
      }
    });
  }));
};

exports.registerGetBeatConfigurationRoute = registerGetBeatConfigurationRoute;