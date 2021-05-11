"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFindRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerFindRoute = (router, managementServicePromise) => {
  const referenceSchema = _configSchema.schema.object({
    type: _configSchema.schema.string(),
    id: _configSchema.schema.string()
  });

  const searchOperatorSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('OR'), _configSchema.schema.literal('AND')], {
    defaultValue: 'OR'
  });

  router.get({
    path: '/api/kibana/management/saved_objects/_find',
    validate: {
      query: _configSchema.schema.object({
        perPage: _configSchema.schema.number({
          min: 0,
          defaultValue: 20
        }),
        page: _configSchema.schema.number({
          min: 0,
          defaultValue: 1
        }),
        type: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),
        search: _configSchema.schema.maybe(_configSchema.schema.string()),
        defaultSearchOperator: searchOperatorSchema,
        sortField: _configSchema.schema.maybe(_configSchema.schema.string()),
        hasReference: _configSchema.schema.maybe(_configSchema.schema.oneOf([referenceSchema, _configSchema.schema.arrayOf(referenceSchema)])),
        hasReferenceOperator: searchOperatorSchema,
        fields: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())], {
          defaultValue: []
        })
      })
    }
  }, router.handleLegacyErrors(async (context, req, res) => {
    const {
      query
    } = req;
    const managementService = await managementServicePromise;
    const {
      getClient,
      typeRegistry
    } = context.core.savedObjects;
    const searchTypes = Array.isArray(query.type) ? query.type : [query.type];
    const includedFields = Array.isArray(query.fields) ? query.fields : [query.fields];
    const importAndExportableTypes = searchTypes.filter(type => typeRegistry.isImportableAndExportable(type));
    const includedHiddenTypes = importAndExportableTypes.filter(type => typeRegistry.isHidden(type));
    const client = getClient({
      includedHiddenTypes
    });
    const searchFields = new Set();
    importAndExportableTypes.forEach(type => {
      const searchField = managementService.getDefaultSearchField(type);

      if (searchField) {
        searchFields.add(searchField);
      }
    });
    const findResponse = await client.find({ ...query,
      fields: undefined,
      searchFields: [...searchFields]
    });
    const enhancedSavedObjects = findResponse.saved_objects.map(so => (0, _lib.injectMetaAttributes)(so, managementService)).map(obj => {
      const result = { ...obj,
        attributes: {}
      };

      for (const field of includedFields) {
        result.attributes[field] = obj.attributes[field];
      }

      return result;
    });
    return res.ok({
      body: { ...findResponse,
        saved_objects: enhancedSavedObjects
      }
    });
  }));
};

exports.registerFindRoute = registerFindRoute;