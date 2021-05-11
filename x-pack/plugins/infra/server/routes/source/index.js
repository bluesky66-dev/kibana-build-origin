"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSourceRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _runtime_types = require("../../../common/runtime_types");

var _source_api = require("../../../common/http_api/source_api");

var _has_data = require("../../lib/sources/has_data");

var _create_search_client = require("../../lib/create_search_client");

var _errors = require("../../lib/sources/errors");

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


const typeToInfraIndexType = value => {
  switch (value) {
    case 'metrics':
      return 'METRICS';

    case 'logs':
      return 'LOGS';

    default:
      return 'ANY';
  }
};

const initSourceRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'get',
    path: '/api/metrics/source/{sourceId}/{type?}',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string(),
        type: _configSchema.schema.string()
      })
    }
  }, async (requestContext, request, response) => {
    try {
      const {
        type,
        sourceId
      } = request.params;
      const [source, logIndexStatus, metricIndicesExist, indexFields] = await Promise.all([libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId), libs.sourceStatus.getLogIndexStatus(requestContext, sourceId), libs.sourceStatus.hasMetricIndices(requestContext, sourceId), libs.fields.getFields(requestContext, sourceId, typeToInfraIndexType(type))]);

      if (!source) {
        return response.notFound();
      }

      const status = {
        logIndicesExist: logIndexStatus !== 'missing',
        metricIndicesExist,
        indexFields
      };
      return response.ok({
        body: _source_api.SourceResponseRuntimeType.encode({
          source: { ...source,
            status
          }
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
  framework.registerRoute({
    method: 'patch',
    path: '/api/metrics/source/{sourceId}',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string()
      }),
      body: (0, _runtime_types.createValidationFunction)(_source_api.SavedSourceConfigurationRuntimeType)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      sources
    } = libs;
    const {
      sourceId
    } = request.params;
    const patchedSourceConfigurationProperties = request.body;

    try {
      const sourceConfiguration = await sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);

      if (sourceConfiguration.origin === 'internal') {
        response.conflict({
          body: 'A conflicting read-only source configuration already exists.'
        });
      }

      const sourceConfigurationExists = sourceConfiguration.origin === 'stored';
      const patchedSourceConfiguration = await (sourceConfigurationExists ? sources.updateSourceConfiguration(requestContext.core.savedObjects.client, sourceId, patchedSourceConfigurationProperties) : sources.createSourceConfiguration(requestContext.core.savedObjects.client, sourceId, patchedSourceConfigurationProperties));
      const [logIndexStatus, metricIndicesExist, indexFields] = await Promise.all([libs.sourceStatus.getLogIndexStatus(requestContext, sourceId), libs.sourceStatus.hasMetricIndices(requestContext, sourceId), libs.fields.getFields(requestContext, sourceId, typeToInfraIndexType('metrics'))]);
      const status = {
        logIndicesExist: logIndexStatus !== 'missing',
        metricIndicesExist,
        indexFields
      };
      return response.ok({
        body: _source_api.SourceResponseRuntimeType.encode({
          source: { ...patchedSourceConfiguration,
            status
          }
        })
      });
    } catch (error) {
      var _error$statusCode, _error$message;

      if (_boom.default.isBoom(error)) {
        throw error;
      }

      if (error instanceof _errors.AnomalyThresholdRangeError) {
        return response.customError({
          statusCode: 400,
          body: {
            message: error.message
          }
        });
      }

      return response.customError({
        statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500,
        body: {
          message: (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : 'An unexpected error occurred'
        }
      });
    }
  }));
  framework.registerRoute({
    method: 'get',
    path: '/api/metrics/source/{sourceId}/{type}/hasData',
    validate: {
      params: _configSchema.schema.object({
        sourceId: _configSchema.schema.string(),
        type: _configSchema.schema.string()
      })
    }
  }, async (requestContext, request, response) => {
    try {
      const {
        type,
        sourceId
      } = request.params;
      const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
      const source = await libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
      const indexPattern = type === 'metrics' ? source.configuration.metricAlias : source.configuration.logAlias;
      const results = await (0, _has_data.hasData)(indexPattern, client);
      return response.ok({
        body: {
          hasData: results
        }
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initSourceRoute = initSourceRoute;