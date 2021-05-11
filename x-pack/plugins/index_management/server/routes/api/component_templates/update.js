"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");

var _schema_validation = require("./schema_validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

const registerUpdateRoute = ({
  router,
  license,
  lib: {
    isEsError
  }
}) => {
  router.put({
    path: (0, _index.addBasePath)('/component_templates/{name}'),
    validate: {
      body: _schema_validation.componentTemplateSchema,
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const {
      name
    } = req.params;
    const {
      template,
      version,
      _meta
    } = req.body;

    try {
      // Verify component exists; ES will throw 404 if not
      await callAsCurrentUser('dataManagement.getComponentTemplate', {
        name
      });
      const response = await callAsCurrentUser('dataManagement.saveComponentTemplate', {
        name,
        body: {
          template,
          version,
          _meta
        }
      });
      return res.ok({
        body: response
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
};

exports.registerUpdateRoute = registerUpdateRoute;