"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = registerDeleteRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");

var _helpers = require("../../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  templates: _configSchema.schema.arrayOf(_configSchema.schema.object({
    name: _configSchema.schema.string(),
    isLegacy: _configSchema.schema.maybe(_configSchema.schema.boolean())
  }))
});

function registerDeleteRoute({
  router,
  license
}) {
  router.post({
    path: (0, _index.addBasePath)('/delete_index_templates'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const {
      templates
    } = req.body;
    const response = {
      templatesDeleted: [],
      errors: []
    };
    await Promise.all(templates.map(async ({
      name,
      isLegacy
    }) => {
      try {
        if (isLegacy) {
          await callAsCurrentUser('indices.deleteTemplate', {
            name
          });
        } else {
          await callAsCurrentUser('dataManagement.deleteComposableIndexTemplate', {
            name
          });
        }

        return response.templatesDeleted.push(name);
      } catch (e) {
        return response.errors.push({
          name,
          error: (0, _helpers.wrapEsError)(e)
        });
      }
    }));
    return res.ok({
      body: response
    });
  }));
}