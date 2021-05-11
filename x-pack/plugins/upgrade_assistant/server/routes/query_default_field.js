"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerQueryDefaultFieldRoutes = registerQueryDefaultFieldRoutes;

var _configSchema = require("@kbn/config-schema");

var _query_default_field = require("../lib/query_default_field");

var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Adds routes for detecting and fixing 6.x Metricbeat indices that need the
 * `index.query.default_field` index setting added.
 *
 * @param server
 */


function registerQueryDefaultFieldRoutes({
  router
}) {
  router.post({
    path: '/api/upgrade_assistant/add_query_default_field/{indexName}',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        fieldTypes: _configSchema.schema.arrayOf(_configSchema.schema.string()),
        otherFields: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
          defaultValue: undefined
        })
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      elasticsearch: {
        client
      }
    }
  }, request, response) => {
    try {
      const {
        indexName
      } = request.params;
      const {
        fieldTypes,
        otherFields
      } = request.body;
      return response.ok({
        body: await (0, _query_default_field.addDefaultField)(client, indexName, new Set(fieldTypes), otherFields ? new Set(otherFields) : undefined)
      });
    } catch (e) {
      const status = e.status || e.statusCode;

      if (status === 403) {
        return response.forbidden({
          body: e
        });
      }

      return response.internalError({
        body: e
      });
    }
  }));
}