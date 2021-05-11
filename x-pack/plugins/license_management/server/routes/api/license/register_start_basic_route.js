"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStartBasicRoute = registerStartBasicRoute;

var _configSchema = require("@kbn/config-schema");

var _start_basic = require("../../../lib/start_basic");

var _helpers = require("../../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerStartBasicRoute({
  router,
  plugins: {
    licensing
  }
}) {
  router.post({
    path: (0, _helpers.addBasePath)('/start_basic'),
    validate: {
      query: _configSchema.schema.object({
        acknowledge: _configSchema.schema.string()
      })
    }
  }, async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.core.elasticsearch.legacy.client;

    try {
      return res.ok({
        body: await (0, _start_basic.startBasic)({
          acknowledge: Boolean(req.query.acknowledge),
          callAsCurrentUser,
          licensing
        })
      });
    } catch (e) {
      return res.internalError({
        body: e
      });
    }
  });
}