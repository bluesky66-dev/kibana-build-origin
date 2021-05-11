"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInternalFindRoute = void 0;

var _operators = require("rxjs/operators");

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../common/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerInternalFindRoute = router => {
  router.post({
    path: '/internal/global_search/find',
    validate: {
      body: _configSchema.schema.object({
        params: _configSchema.schema.object({
          term: _configSchema.schema.maybe(_configSchema.schema.string()),
          types: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
          tags: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
        }),
        options: _configSchema.schema.maybe(_configSchema.schema.object({
          preference: _configSchema.schema.maybe(_configSchema.schema.string())
        }))
      })
    }
  }, async (ctx, req, res) => {
    const {
      params,
      options
    } = req.body;

    try {
      const allResults = await ctx.globalSearch.find(params, { ...options,
        aborted$: req.events.aborted$
      }).pipe((0, _operators.map)(batch => batch.results), (0, _operators.reduce)((acc, results) => [...acc, ...results])).toPromise();
      return res.ok({
        body: {
          results: allResults
        }
      });
    } catch (e) {
      if (e instanceof _errors.GlobalSearchFindError && e.type === 'invalid-license') {
        return res.forbidden({
          body: e.message
        });
      }

      throw e;
    }
  });
};

exports.registerInternalFindRoute = registerInternalFindRoute;