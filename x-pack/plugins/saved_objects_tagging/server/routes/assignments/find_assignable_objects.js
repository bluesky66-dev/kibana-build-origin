"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFindAssignableObjectsRoute = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerFindAssignableObjectsRoute = router => {
  router.get({
    path: '/internal/saved_objects_tagging/assignments/_find_assignable_objects',
    validate: {
      query: _configSchema.schema.object({
        search: _configSchema.schema.maybe(_configSchema.schema.string()),
        max_results: _configSchema.schema.number({
          min: 0,
          defaultValue: 1000
        }),
        types: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]))
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const {
      assignmentService
    } = ctx.tags;
    const {
      query
    } = req;
    const results = await assignmentService.findAssignableObjects({
      search: query.search,
      types: typeof query.types === 'string' ? [query.types] : query.types,
      maxResults: query.max_results
    });
    return res.ok({
      body: {
        objects: results
      }
    });
  }));
};

exports.registerFindAssignableObjectsRoute = registerFindAssignableObjectsRoute;