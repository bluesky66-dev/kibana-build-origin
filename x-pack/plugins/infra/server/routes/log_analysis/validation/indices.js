"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initValidateLogAnalysisIndicesRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _configSchema = require("@kbn/config-schema");

var _http_api = require("../../../../common/http_api");

var _runtime_types = require("../../../../common/runtime_types");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

const initValidateLogAnalysisIndicesRoute = ({
  framework
}) => {
  framework.registerRoute({
    method: 'post',
    path: _http_api.LOG_ANALYSIS_VALIDATE_INDICES_PATH,
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const payload = (0, _pipeable.pipe)(_http_api.validationIndicesRequestPayloadRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const {
        fields,
        indices
      } = payload.data;
      const errors = []; // Query each pattern individually, to map correctly the errors

      await Promise.all(indices.map(async index => {
        const fieldCaps = await framework.callWithRequest(requestContext, 'fieldCaps', {
          allow_no_indices: true,
          fields: fields.map(field => field.name),
          ignore_unavailable: true,
          index
        });

        if (fieldCaps.indices.length === 0) {
          errors.push({
            error: 'INDEX_NOT_FOUND',
            index
          });
          return;
        }

        fields.forEach(({
          name: fieldName,
          validTypes
        }) => {
          const fieldMetadata = fieldCaps.fields[fieldName];

          if (fieldMetadata === undefined) {
            errors.push({
              error: 'FIELD_NOT_FOUND',
              index,
              field: fieldName
            });
          } else {
            const fieldTypes = Object.keys(fieldMetadata);

            if (!fieldTypes.every(fieldType => validTypes.includes(fieldType))) {
              errors.push({
                error: `FIELD_NOT_VALID`,
                index,
                field: fieldName
              });
            }
          }
        });
      }));
      return response.ok({
        body: _http_api.validationIndicesResponsePayloadRT.encode({
          data: {
            errors
          }
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initValidateLogAnalysisIndicesRoute = initValidateLogAnalysisIndicesRoute;