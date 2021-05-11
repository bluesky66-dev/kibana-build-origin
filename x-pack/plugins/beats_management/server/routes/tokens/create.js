"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateTokenRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _security = require("../../../common/constants/security");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_NUM_TOKENS = 1;

const registerCreateTokenRoute = router => {
  // TODO: write to Kibana audit log file
  router.post({
    path: '/api/beats/enrollment_tokens',
    validate: {
      body: _configSchema.schema.nullable(_configSchema.schema.object({
        num_tokens: _configSchema.schema.number({
          defaultValue: DEFAULT_NUM_TOKENS,
          min: 1
        })
      }))
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _security.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    var _request$body$num_tok, _request$body;

    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const numTokens = (_request$body$num_tok = (_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.num_tokens) !== null && _request$body$num_tok !== void 0 ? _request$body$num_tok : DEFAULT_NUM_TOKENS;

    try {
      const tokens = await beatsManagement.tokens.createEnrollmentTokens(user, numTokens);
      return response.ok({
        body: {
          results: tokens.map(token => ({
            item: token,
            success: true,
            action: 'created'
          })),
          success: true
        }
      });
    } catch (err) {
      beatsManagement.framework.log(err.message);
      return response.internalError({
        body: {
          message: 'An error occurred, please check your Kibana logs'
        }
      });
    }
  }));
};

exports.registerCreateTokenRoute = registerCreateTokenRoute;