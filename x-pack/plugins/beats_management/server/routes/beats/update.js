"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBeatUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _router = require("../../../../../../src/core/server/http/router");

var _security = require("../../../common/constants/security");

var _adapter_types = require("../../lib/adapters/framework/adapter_types");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const registerBeatUpdateRoute = router => {
  // TODO: write to Kibana audit log file (include who did the verification as well) https://github.com/elastic/kibana/issues/26024
  router.put({
    path: '/api/beats/agent/{beatId}',
    validate: {
      params: _configSchema.schema.object({
        beatId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        active: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        ephemeral_id: _configSchema.schema.maybe(_configSchema.schema.string()),
        host_name: _configSchema.schema.maybe(_configSchema.schema.string()),
        local_configuration_yml: _configSchema.schema.maybe(_configSchema.schema.string()),
        metadata: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
        name: _configSchema.schema.maybe(_configSchema.schema.string()),
        type: _configSchema.schema.maybe(_configSchema.schema.string()),
        version: _configSchema.schema.maybe(_configSchema.schema.string())
      }, {
        defaultValue: {}
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const accessToken = request.headers['kbn-beats-access-token'];
    const {
      beatId
    } = request.params;
    const user = beatsManagement.framework.getUser(request);
    const userOrToken = accessToken || user; // TODO: fixme eventually, need to access `info.remoteAddress` from KibanaRequest.

    const legacyRequest = (0, _router.ensureRawRequest)(request);
    const remoteAddress = legacyRequest.info.remoteAddress;

    if (user.kind === 'unauthenticated' && request.body.active !== undefined) {
      return response.unauthorized({
        body: {
          message: 'access-token is not a valid auth type to change beat status'
        }
      });
    }

    const status = await beatsManagement.beats.update(userOrToken, beatId, { ...request.body,
      host_ip: remoteAddress
    });

    switch (status) {
      case 'beat-not-found':
        return response.notFound({
          body: {
            message: 'Beat not found'
          }
        });

      case 'invalid-access-token':
        return response.unauthorized({
          body: {
            message: 'Invalid access token'
          }
        });
    }

    const beat = await beatsManagement.beats.getById(_adapter_types.internalUser, beatId);

    if (!beat) {
      return response.notFound({
        body: {
          message: 'Beat not found'
        }
      });
    }

    return response.ok({
      body: {
        item: beat,
        action: 'updated',
        success: true
      }
    });
  }));
};

exports.registerBeatUpdateRoute = registerBeatUpdateRoute;