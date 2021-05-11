"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerGetRoute = (router, managementServicePromise) => {
  router.get({
    path: '/api/kibana/management/saved_objects/{type}/{id}',
    validate: {
      params: _configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      })
    }
  }, router.handleLegacyErrors(async (context, req, res) => {
    const {
      type,
      id
    } = req.params;
    const managementService = await managementServicePromise;
    const {
      getClient,
      typeRegistry
    } = context.core.savedObjects;
    const includedHiddenTypes = [type].filter(entry => typeRegistry.isHidden(entry) && typeRegistry.isImportableAndExportable(entry));
    const client = getClient({
      includedHiddenTypes
    });
    const findResponse = await client.get(type, id);
    const enhancedSavedObject = (0, _lib.injectMetaAttributes)(findResponse, managementService);
    return res.ok({
      body: enhancedSavedObject
    });
  }));
};

exports.registerGetRoute = registerGetRoute;