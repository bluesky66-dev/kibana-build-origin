"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeESFieldsRoute = initializeESFieldsRoute;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../common/lib");

var _catch_error_handler = require("../catch_error_handler");

var _normalize_type = require("../../lib/normalize_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ESFieldsRequestSchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});

function initializeESFieldsRoute(deps) {
  const {
    router
  } = deps;
  router.get({
    path: `${_lib.API_ROUTE}/es_fields`,
    validate: {
      query: ESFieldsRequestSchema
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    const {
      callAsCurrentUser
    } = context.core.elasticsearch.legacy.client;
    const {
      index,
      fields
    } = request.query;
    const config = {
      index,
      fields: fields || '*'
    };
    const esFields = await callAsCurrentUser('fieldCaps', config).then(resp => {
      return (0, _lodash.mapValues)(resp.fields, types => {
        if ((0, _lodash.keys)(types).length > 1) {
          return 'conflict';
        }

        try {
          return (0, _normalize_type.normalizeType)((0, _lodash.keys)(types)[0]);
        } catch (e) {
          return 'unsupported';
        }
      });
    });
    return response.ok({
      body: esFields
    });
  }));
}