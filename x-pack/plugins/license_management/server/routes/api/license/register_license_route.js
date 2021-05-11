"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLicenseRoute = registerLicenseRoute;

var _configSchema = require("@kbn/config-schema");

var _license = require("../../../lib/license");

var _helpers = require("../../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerLicenseRoute({
  router,
  plugins: {
    licensing
  }
}) {
  router.put({
    path: (0, _helpers.addBasePath)(''),
    validate: {
      query: _configSchema.schema.object({
        acknowledge: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        license: _configSchema.schema.object({}, {
          unknowns: 'allow'
        })
      })
    }
  }, async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.core.elasticsearch.legacy.client;

    try {
      return res.ok({
        body: await (0, _license.putLicense)({
          acknowledge: Boolean(req.query.acknowledge),
          callAsCurrentUser,
          licensing,
          license: req.body
        })
      });
    } catch (e) {
      return res.internalError({
        body: e
      });
    }
  });
}