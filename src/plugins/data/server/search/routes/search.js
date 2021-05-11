"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchRoute = registerSearchRoute;

var _operators = require("rxjs/operators");

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../lib");

var _server = require("../../../../kibana_utils/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerSearchRoute(router) {
  router.post({
    path: '/internal/search/{strategy}/{id?}',
    validate: {
      params: _configSchema.schema.object({
        strategy: _configSchema.schema.string(),
        id: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      query: _configSchema.schema.object({}, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        legacyHitsTotal: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        sessionId: _configSchema.schema.maybe(_configSchema.schema.string()),
        isStored: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        isRestore: _configSchema.schema.maybe(_configSchema.schema.boolean())
      }, {
        unknowns: 'allow'
      })
    }
  }, async (context, request, res) => {
    const {
      legacyHitsTotal = true,
      sessionId,
      isStored,
      isRestore,
      ...searchRequest
    } = request.body;
    const {
      strategy,
      id
    } = request.params;
    const abortSignal = (0, _lib.getRequestAbortedSignal)(request.events.aborted$);

    try {
      const response = await context.search.search({ ...searchRequest,
        id
      }, {
        abortSignal,
        strategy,
        legacyHitsTotal,
        sessionId,
        isStored,
        isRestore
      }).pipe((0, _operators.first)()).toPromise();
      return res.ok({
        body: response
      });
    } catch (err) {
      return (0, _server.reportServerError)(res, err);
    }
  });
  router.delete({
    path: '/internal/search/{strategy}/{id}',
    validate: {
      params: _configSchema.schema.object({
        strategy: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    }
  }, async (context, request, res) => {
    const {
      strategy,
      id
    } = request.params;

    try {
      await context.search.cancel(id, {
        strategy
      });
      return res.ok();
    } catch (err) {
      return (0, _server.reportServerError)(res, err);
    }
  });
}