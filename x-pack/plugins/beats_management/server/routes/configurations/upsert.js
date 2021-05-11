"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpsertConfigurationBlocksRoute = void 0;

var _PathReporter = require("io-ts/lib/PathReporter");

var _Either = require("fp-ts/lib/Either");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _domain_types = require("../../../common/domain_types");

var _wrap_route_with_security = require("../wrap_route_with_security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerUpsertConfigurationBlocksRoute = router => {
  // TODO: write to Kibana audit log file
  router.put({
    path: '/api/beats/configurations',
    validate: {
      body: _configSchema.schema.arrayOf(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any()), {
        defaultValue: []
      })
    }
  }, (0, _wrap_route_with_security.wrapRouteWithSecurity)({
    requiredLicense: _constants.REQUIRED_LICENSES,
    requiredRoles: ['beats_admin']
  }, async (context, request, response) => {
    const beatsManagement = context.beatsManagement;
    const user = beatsManagement.framework.getUser(request);
    const input = request.body;
    const result = await Promise.all(input.map(async block => {
      const assertData = (0, _domain_types.createConfigurationBlockInterface)().decode(block);

      if ((0, _Either.isLeft)(assertData)) {
        return {
          error: `Error parsing block info, ${_PathReporter.PathReporter.report(assertData)[0]}`
        };
      }

      const {
        blockID,
        success,
        error
      } = await beatsManagement.configurationBlocks.save(user, block);

      if (error) {
        return {
          success,
          error
        };
      }

      return {
        success,
        blockID
      };
    }));
    return response.ok({
      body: {
        results: result.map(r => ({
          success: r.success,
          // TODO: we need to surface this data, not hard coded
          action: 'created'
        })),
        success: true
      }
    });
  }));
};

exports.registerUpsertConfigurationBlocksRoute = registerUpsertConfigurationBlocksRoute;