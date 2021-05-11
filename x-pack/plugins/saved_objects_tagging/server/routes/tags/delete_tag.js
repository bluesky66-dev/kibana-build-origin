"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteTagRoute = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDeleteTagRoute = router => {
  router.delete({
    path: '/api/saved_objects_tagging/tags/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const {
      id
    } = req.params;
    await ctx.tags.tagsClient.delete(id);
    return res.ok();
  }));
};

exports.registerDeleteTagRoute = registerDeleteTagRoute;