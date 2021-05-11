"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRelationshipsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _lib = require("../lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerRelationshipsRoute = (router, managementServicePromise) => {
  router.get({
    path: '/api/kibana/management/saved_objects/relationships/{type}/{id}',
    validate: {
      params: _configSchema.schema.object({
        type: _configSchema.schema.string(),
        id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        size: _configSchema.schema.number({
          defaultValue: 10000
        }),
        savedObjectTypes: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])
      })
    }
  }, router.handleLegacyErrors(async (context, req, res) => {
    const managementService = await managementServicePromise;
    const {
      getClient,
      typeRegistry
    } = context.core.savedObjects;
    const {
      type,
      id
    } = req.params;
    const {
      size,
      savedObjectTypes: maybeArraySavedObjectTypes
    } = req.query;
    const savedObjectTypes = Array.isArray(maybeArraySavedObjectTypes) ? maybeArraySavedObjectTypes : [maybeArraySavedObjectTypes];
    const includedHiddenTypes = (0, _lodash.chain)(maybeArraySavedObjectTypes).uniq().filter(entry => typeRegistry.isHidden(entry) && typeRegistry.isImportableAndExportable(entry)).value();
    const client = getClient({
      includedHiddenTypes
    });
    const findRelationsResponse = await (0, _lib.findRelationships)({
      type,
      id,
      client,
      size,
      referenceTypes: savedObjectTypes,
      savedObjectsManagement: managementService
    });
    return res.ok({
      body: findRelationsResponse
    });
  }));
};

exports.registerRelationshipsRoute = registerRelationshipsRoute;