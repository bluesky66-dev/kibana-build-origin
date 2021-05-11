"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = registerUpdateRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");

var _validate_schemas = require("./validate_schemas");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _validate_schemas.templateSchema;

const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

const querySchema = _configSchema.schema.object({
  include_type_name: _configSchema.schema.maybe(_configSchema.schema.string())
});

function registerUpdateRoute({
  router,
  license,
  lib
}) {
  router.put({
    path: (0, _index.addBasePath)('/index_templates/{name}'),
    validate: {
      body: bodySchema,
      params: paramsSchema,
      query: querySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const {
      name
    } = req.params; // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      include_type_name
    } = req.query;
    const template = req.body;
    const {
      _kbnMeta: {
        isLegacy
      }
    } = template; // Verify the template exists (ES will throw 404 if not)

    const doesExist = await (0, _lib.doesTemplateExist)({
      name,
      callAsCurrentUser,
      isLegacy
    });

    if (!doesExist) {
      return res.notFound();
    }

    try {
      // Next, update index template
      const response = await (0, _lib.saveTemplate)({
        template,
        callAsCurrentUser,
        isLegacy,
        include_type_name
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      if (lib.isEsError(e)) {
        const error = lib.parseEsError(e.response);
        return res.customError({
          statusCode: e.statusCode,
          body: {
            message: error.message,
            attributes: error
          }
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  }));
}