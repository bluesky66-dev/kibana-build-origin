"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllTagsRoute = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerGetAllTagsRoute = router => {
  router.get({
    path: '/api/saved_objects_tagging/tags',
    validate: {}
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const tags = await ctx.tags.tagsClient.getAll();
    return res.ok({
      body: {
        tags
      }
    });
  }));
};

exports.registerGetAllTagsRoute = registerGetAllTagsRoute;