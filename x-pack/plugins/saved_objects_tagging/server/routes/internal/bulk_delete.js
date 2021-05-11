"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInternalBulkDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerInternalBulkDeleteRoute = router => {
  router.post({
    path: '/internal/saved_objects_tagging/tags/_bulk_delete',
    validate: {
      body: _configSchema.schema.object({
        ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const {
      ids: tagIds
    } = req.body;
    const client = ctx.tags.tagsClient;

    for (const tagId of tagIds) {
      await client.delete(tagId);
    }

    return res.ok({
      body: {}
    });
  }));
};

exports.registerInternalBulkDeleteRoute = registerInternalBulkDeleteRoute;