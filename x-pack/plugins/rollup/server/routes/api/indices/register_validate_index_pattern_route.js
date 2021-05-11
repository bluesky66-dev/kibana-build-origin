"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerValidateIndexPatternRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isNumericField(fieldCapability) {
  const numericTypes = ['long', 'integer', 'short', 'byte', 'double', 'float', 'half_float', 'scaled_float'];
  return numericTypes.some(numericType => fieldCapability[numericType] != null);
}
/**
 * Returns information on validity of an index pattern for creating a rollup job:
 *  - Does the index pattern match any indices?
 *  - Does the index pattern match rollup indices?
 *  - Which date fields, numeric fields, and keyword fields are available in the matching indices?
 */


const registerValidateIndexPatternRoute = ({
  router,
  license,
  lib: {
    isEsError,
    formatEsError
  }
}) => {
  router.get({
    path: (0, _services.addBasePath)('/index_pattern_validity/{indexPattern}'),
    validate: {
      params: _configSchema.schema.object({
        indexPattern: _configSchema.schema.string()
      })
    }
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        indexPattern
      } = request.params;
      const [fieldCapabilities, rollupIndexCapabilities] = await Promise.all([context.rollup.client.callAsCurrentUser('rollup.fieldCapabilities', {
        indexPattern
      }), context.rollup.client.callAsCurrentUser('rollup.rollupIndexCapabilities', {
        indexPattern
      })]);
      const doesMatchIndices = Object.entries(fieldCapabilities.fields).length !== 0;
      const doesMatchRollupIndices = Object.entries(rollupIndexCapabilities).length !== 0;
      const dateFields = [];
      const numericFields = [];
      const keywordFields = [];
      const fieldCapabilitiesEntries = Object.entries(fieldCapabilities.fields);
      fieldCapabilitiesEntries.forEach(([fieldName, fieldCapability]) => {
        if (fieldCapability.date) {
          dateFields.push(fieldName);
          return;
        }

        if (isNumericField(fieldCapability)) {
          numericFields.push(fieldName);
          return;
        }

        if (fieldCapability.keyword) {
          keywordFields.push(fieldName);
        }
      });
      const body = {
        doesMatchIndices,
        doesMatchRollupIndices,
        dateFields,
        numericFields,
        keywordFields
      };
      return response.ok({
        body
      });
    } catch (err) {
      // 404s are still valid results.
      if (err.statusCode === 404) {
        const notFoundBody = {
          doesMatchIndices: false,
          doesMatchRollupIndices: false,
          dateFields: [],
          numericFields: [],
          keywordFields: []
        };
        return response.ok({
          body: notFoundBody
        });
      }

      if (isEsError(err)) {
        return response.customError({
          statusCode: err.statusCode,
          body: err
        });
      }

      return response.internalError({
        body: err
      });
    }
  }));
};

exports.registerValidateIndexPatternRoute = registerValidateIndexPatternRoute;