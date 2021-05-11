"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  names: _configSchema.schema.string()
});

const registerDeleteRoute = ({
  router,
  license
}) => {
  router.delete({
    path: (0, _index.addBasePath)('/component_templates/{names}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const {
      names
    } = req.params;
    const componentNames = names.split(',');
    const response = {
      itemsDeleted: [],
      errors: []
    };
    await Promise.all(componentNames.map(componentName => {
      return callAsCurrentUser('dataManagement.deleteComponentTemplate', {
        name: componentName
      }).then(() => response.itemsDeleted.push(componentName)).catch(e => response.errors.push({
        name: componentName,
        error: e
      }));
    }));
    return res.ok({
      body: response
    });
  }));
};

exports.registerDeleteRoute = registerDeleteRoute;