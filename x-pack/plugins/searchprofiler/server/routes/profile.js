"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const register = ({
  router,
  getLicenseStatus,
  log
}) => {
  router.post({
    path: '/api/searchprofiler/profile',
    validate: {
      body: _configSchema.schema.object({
        query: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        index: _configSchema.schema.string()
      })
    }
  }, async (ctx, request, response) => {
    const currentLicenseStatus = getLicenseStatus();

    if (!currentLicenseStatus.valid) {
      return response.forbidden({
        body: {
          message: currentLicenseStatus.message
        }
      });
    }

    const {
      body: {
        query,
        index
      }
    } = request;
    const parsed = {
      // Activate profiler mode for this query.
      profile: true,
      ...query
    };
    const body = {
      index,
      body: JSON.stringify(parsed, null, 2)
    };

    try {
      const client = ctx.core.elasticsearch.client.asCurrentUser;
      const resp = await client.search(body);
      return response.ok({
        body: {
          ok: true,
          resp: resp.body
        }
      });
    } catch (err) {
      var _errorBody$error;

      log.error(err);
      const {
        statusCode,
        body: errorBody
      } = err;
      return response.customError({
        statusCode: statusCode || 500,
        body: errorBody ? {
          message: (_errorBody$error = errorBody.error) === null || _errorBody$error === void 0 ? void 0 : _errorBody$error.reason,
          attributes: errorBody
        } : err
      });
    }
  });
};

exports.register = register;