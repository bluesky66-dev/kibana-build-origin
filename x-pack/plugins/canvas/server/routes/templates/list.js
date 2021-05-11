"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeListTemplates = initializeListTemplates;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/lib/constants");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initializeListTemplates(deps) {
  const {
    router
  } = deps;
  router.get({
    path: `${_constants.API_ROUTE_TEMPLATES}`,
    validate: {
      params: _configSchema.schema.object({})
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    const savedObjectsClient = context.core.savedObjects.client;
    const templates = await savedObjectsClient.find({
      type: _constants.TEMPLATE_TYPE,
      sortField: 'name.keyword',
      sortOrder: 'desc',
      search: '*',
      searchFields: ['name', 'help'],
      fields: ['id', 'name', 'help', 'tags']
    });
    return response.ok({
      body: {
        templates: templates.saved_objects.map(hit => ({ ...hit.attributes
        }))
      }
    });
  }));
}