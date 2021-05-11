"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFindRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerFindRoute = (router, {
  coreUsageData
}) => {
  const referenceSchema = _configSchema.schema.object({
    type: _configSchema.schema.string(),
    id: _configSchema.schema.string()
  });

  const searchOperatorSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('OR'), _configSchema.schema.literal('AND')], {
    defaultValue: 'OR'
  });

  router.get({
    path: '/_find',
    validate: {
      query: _configSchema.schema.object({
        per_page: _configSchema.schema.number({
          min: 0,
          defaultValue: 20
        }),
        page: _configSchema.schema.number({
          min: 0,
          defaultValue: 1
        }),
        type: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),
        search: _configSchema.schema.maybe(_configSchema.schema.string()),
        default_search_operator: searchOperatorSchema,
        search_fields: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
        sort_field: _configSchema.schema.maybe(_configSchema.schema.string()),
        has_reference: _configSchema.schema.maybe(_configSchema.schema.oneOf([referenceSchema, _configSchema.schema.arrayOf(referenceSchema)])),
        has_reference_operator: searchOperatorSchema,
        fields: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
        filter: _configSchema.schema.maybe(_configSchema.schema.string()),
        namespaces: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]))
      })
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const query = req.query;
    const namespaces = typeof req.query.namespaces === 'string' ? [req.query.namespaces] : req.query.namespaces;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementSavedObjectsFind({
      request: req
    }).catch(() => {});
    const result = await context.core.savedObjects.client.find({
      perPage: query.per_page,
      page: query.page,
      type: Array.isArray(query.type) ? query.type : [query.type],
      search: query.search,
      defaultSearchOperator: query.default_search_operator,
      searchFields: typeof query.search_fields === 'string' ? [query.search_fields] : query.search_fields,
      sortField: query.sort_field,
      hasReference: query.has_reference,
      hasReferenceOperator: query.has_reference_operator,
      fields: typeof query.fields === 'string' ? [query.fields] : query.fields,
      filter: query.filter,
      namespaces
    });
    return res.ok({
      body: result
    });
  }));
};

exports.registerFindRoute = registerFindRoute;