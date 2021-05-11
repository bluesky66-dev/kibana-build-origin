"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllRoute = registerGetAllRoute;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../../common/lib");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

function registerGetAllRoute({
  router,
  license,
  lib: {
    isEsError
  }
}) {
  // Get all component templates
  router.get({
    path: (0, _index.addBasePath)('/component_templates'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;

    try {
      const {
        component_templates: componentTemplates
      } = await callAsCurrentUser('dataManagement.getComponentTemplates');
      const {
        index_templates: indexTemplates
      } = await callAsCurrentUser('dataManagement.getComposableIndexTemplates');
      const body = componentTemplates.map(componentTemplate => {
        const deserializedComponentTemplateListItem = (0, _lib.deserializeComponentTemplateList)(componentTemplate, indexTemplates);
        return deserializedComponentTemplateListItem;
      });
      return res.ok({
        body
      });
    } catch (error) {
      if (isEsError(error)) {
        return res.customError({
          statusCode: error.statusCode,
          body: error
        });
      }

      return res.internalError({
        body: error
      });
    }
  })); // Get single component template

  router.get({
    path: (0, _index.addBasePath)('/component_templates/{name}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const {
      name
    } = req.params;

    try {
      const {
        component_templates: componentTemplates
      } = await callAsCurrentUser('dataManagement.getComponentTemplates', {
        name
      });
      const {
        index_templates: indexTemplates
      } = await callAsCurrentUser('dataManagement.getComposableIndexTemplates');
      return res.ok({
        body: (0, _lib.deserializeComponentTemplate)(componentTemplates[0], indexTemplates)
      });
    } catch (error) {
      if (isEsError(error)) {
        return res.customError({
          statusCode: error.statusCode,
          body: error
        });
      }

      return res.internalError({
        body: error
      });
    }
  }));
}