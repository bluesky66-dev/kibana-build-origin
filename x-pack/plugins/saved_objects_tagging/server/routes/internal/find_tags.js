"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInternalFindTagsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _tags = require("../../services/tags");

var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerInternalFindTagsRoute = router => {
  router.get({
    path: '/internal/saved_objects_tagging/tags/_find',
    validate: {
      query: _configSchema.schema.object({
        perPage: _configSchema.schema.number({
          min: 0,
          defaultValue: 20
        }),
        page: _configSchema.schema.number({
          min: 0,
          defaultValue: 1
        }),
        search: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const {
      query
    } = req;
    const {
      client,
      typeRegistry
    } = ctx.core.savedObjects;
    const findResponse = await client.find({
      page: query.page,
      perPage: query.perPage,
      search: query.search,
      type: [_constants.tagSavedObjectTypeName],
      searchFields: ['title', 'description']
    });
    const tags = findResponse.saved_objects.map(_tags.savedObjectToTag);
    const allTypes = typeRegistry.getAllTypes().map(type => type.name);
    const tagsWithConnections = await (0, _lib.addConnectionCount)(tags, allTypes, client);
    return res.ok({
      body: {
        tags: tagsWithConnections,
        total: findResponse.total
      }
    });
  }));
};

exports.registerInternalFindTagsRoute = registerInternalFindTagsRoute;