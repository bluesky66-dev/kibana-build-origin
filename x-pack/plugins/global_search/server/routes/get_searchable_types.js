"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInternalSearchableTypesRoute = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerInternalSearchableTypesRoute = router => {
  router.get({
    path: '/internal/global_search/searchable_types',
    validate: false
  }, async (ctx, req, res) => {
    const types = await ctx.globalSearch.getSearchableTypes();
    return res.ok({
      body: {
        types
      }
    });
  });
};

exports.registerInternalSearchableTypesRoute = registerInternalSearchableTypesRoute;