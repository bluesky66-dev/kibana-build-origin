"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllRoute = registerGetAllRoute;
exports.registerGetOneRoute = registerGetOneRoute;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../../common/lib");

var _get_managed_templates = require("../../../lib/get_managed_templates");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerGetAllRoute({
  router,
  license
}) {
  router.get({
    path: (0, _index.addBasePath)('/index_templates'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const cloudManagedTemplatePrefix = await (0, _get_managed_templates.getCloudManagedTemplatePrefix)(callAsCurrentUser);
    const legacyTemplatesEs = await callAsCurrentUser('indices.getTemplate', {
      include_type_name: true
    });
    const {
      index_templates: templatesEs
    } = await callAsCurrentUser('dataManagement.getComposableIndexTemplates');
    const legacyTemplates = (0, _lib.deserializeLegacyTemplateList)(legacyTemplatesEs, cloudManagedTemplatePrefix);
    const templates = (0, _lib.deserializeTemplateList)(templatesEs, cloudManagedTemplatePrefix);
    const body = {
      templates,
      legacyTemplates
    };
    return res.ok({
      body
    });
  }));
}

const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
}); // Require the template format version (V1 or V2) to be provided as Query param


const querySchema = _configSchema.schema.object({
  legacy: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')]))
});

function registerGetOneRoute({
  router,
  license,
  lib
}) {
  router.get({
    path: (0, _index.addBasePath)('/index_templates/{name}'),
    validate: {
      params: paramsSchema,
      query: querySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      name
    } = req.params;
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const isLegacy = req.query.legacy === 'true';

    try {
      const cloudManagedTemplatePrefix = await (0, _get_managed_templates.getCloudManagedTemplatePrefix)(callAsCurrentUser);

      if (isLegacy) {
        const indexTemplateByName = await callAsCurrentUser('indices.getTemplate', {
          name,
          include_type_name: true
        });

        if (indexTemplateByName[name]) {
          return res.ok({
            body: (0, _lib.deserializeLegacyTemplate)({ ...indexTemplateByName[name],
              name
            }, cloudManagedTemplatePrefix)
          });
        }
      } else {
        const {
          index_templates: indexTemplates
        } = await callAsCurrentUser('dataManagement.getComposableIndexTemplate', {
          name
        });

        if (indexTemplates.length > 0) {
          return res.ok({
            body: (0, _lib.deserializeTemplate)({ ...indexTemplates[0].index_template,
              name
            }, cloudManagedTemplatePrefix)
          });
        }
      }

      return res.notFound();
    } catch (e) {
      if (lib.isEsError(e)) {
        return res.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  }));
}