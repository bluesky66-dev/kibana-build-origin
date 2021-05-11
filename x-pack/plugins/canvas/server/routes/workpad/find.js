"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeFindWorkpadsRoute = initializeFindWorkpadsRoute;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeFindWorkpadsRoute(deps) {
  const {
    router
  } = deps;
  router.get({
    path: `${_constants.API_ROUTE_WORKPAD}/find`,
    validate: {
      query: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        page: _configSchema.schema.maybe(_configSchema.schema.number()),
        perPage: _configSchema.schema.number()
      })
    }
  }, async (context, request, response) => {
    const savedObjectsClient = context.core.savedObjects.client;
    const {
      name,
      page,
      perPage
    } = request.query;

    try {
      const workpads = await savedObjectsClient.find({
        type: _constants.CANVAS_TYPE,
        sortField: '@timestamp',
        sortOrder: 'desc',
        search: name ? `${name}* | ${name}` : '*',
        searchFields: ['name'],
        fields: ['id', 'name', '@created', '@timestamp'],
        page,
        perPage
      });
      return response.ok({
        body: {
          total: workpads.total,
          workpads: workpads.saved_objects.map(hit => ({
            id: hit.id,
            ...hit.attributes
          }))
        }
      });
    } catch (error) {
      return response.ok({
        body: {
          total: 0,
          workpads: []
        }
      });
    }
  });
}