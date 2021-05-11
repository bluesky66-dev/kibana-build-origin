"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBeatEnrollmentRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _router = require("../../../../../../src/core/server/http/router");

var _security = require("../../../common/constants/security");

var _types = require("../../lib/types");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const registerBeatEnrollmentRoute = router => {
  // TODO: write to Kibana audit log file https://github.com/elastic/kibana/issues/26024
  router.post({
    path: '/api/beats/agent/{beatId}',
    validate: {
      params: _configSchema.schema.object({
        beatId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        host_name: _configSchema.schema.string(),
        name: _configSchema.schema.string(),
        type: _configSchema.schema.string(),
        version: _configSchema.schema.string()
      }, {
        unknowns: 'ignore'
      })
    },
    options: {
      authRequired: false
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const {
      beatId
    } = request.params;
    const enrollmentToken = request.headers['kbn-beats-enrollment-token'];

    if (!enrollmentToken) {
      return response.badRequest({
        body: 'beats enrollment token required'
      });
    } // TODO: fixme eventually, need to access `info.remoteAddress` from KibanaRequest.


    const legacyRequest = (0, _router.ensureRawRequest)(request);
    const {
      status,
      accessToken
    } = await beatsManagement.beats.enrollBeat(enrollmentToken, beatId, legacyRequest.info.remoteAddress, request.body);

    switch (status) {
      case _types.BeatEnrollmentStatus.ExpiredEnrollmentToken:
        return response.badRequest({
          body: {
            message: _types.BeatEnrollmentStatus.ExpiredEnrollmentToken
          }
        });

      case _types.BeatEnrollmentStatus.InvalidEnrollmentToken:
        return response.badRequest({
          body: {
            message: _types.BeatEnrollmentStatus.InvalidEnrollmentToken
          }
        });

      case _types.BeatEnrollmentStatus.Success:
      default:
        return response.ok({
          body: {
            item: accessToken,
            action: 'created',
            success: true
          }
        });
    }
  }));
};

exports.registerBeatEnrollmentRoute = registerBeatEnrollmentRoute;