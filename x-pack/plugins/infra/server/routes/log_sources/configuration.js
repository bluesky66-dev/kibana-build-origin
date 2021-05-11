"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initLogSourceConfigurationRoutes = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _log_sources = require("../../../common/http_api/log_sources");

var _runtime_types = require("../../../common/runtime_types");

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


const initLogSourceConfigurationRoutes = ({
  framework,
  sources
}) => {
  framework.registerRoute({
    method: 'get',
    path: _log_sources.LOG_SOURCE_CONFIGURATION_PATH,
    validate: {
      params: (0, _runtime_types.createValidationFunction)(_log_sources.getLogSourceConfigurationRequestParamsRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      sourceId
    } = request.params;

    try {
      const sourceConfiguration = await sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
      return response.ok({
        body: _log_sources.getLogSourceConfigurationSuccessResponsePayloadRT.encode({
          data: sourceConfiguration
        })
      });
    } catch (error) {
      var _error$statusCode, _error$message;

      if (_boom.default.isBoom(error)) {
        throw error;
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
    method: 'patch',
    path: _log_sources.LOG_SOURCE_CONFIGURATION_PATH,
    validate: {
      params: (0, _runtime_types.createValidationFunction)(_log_sources.patchLogSourceConfigurationRequestParamsRT),
      body: (0, _runtime_types.createValidationFunction)(_log_sources.patchLogSourceConfigurationRequestBodyRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      sourceId
    } = request.params;
    const {
      data: patchedSourceConfigurationProperties
    } = request.body;

    try {
      const sourceConfiguration = await sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);

      if (sourceConfiguration.origin === 'internal') {
        response.conflict({
          body: 'A conflicting read-only source configuration already exists.'
        });
      }

      const sourceConfigurationExists = sourceConfiguration.origin === 'stored';
      const patchedSourceConfiguration = await (sourceConfigurationExists ? sources.updateSourceConfiguration(requestContext.core.savedObjects.client, sourceId, patchedSourceConfigurationProperties) : sources.createSourceConfiguration(requestContext.core.savedObjects.client, sourceId, patchedSourceConfigurationProperties));
      return response.ok({
        body: _log_sources.patchLogSourceConfigurationSuccessResponsePayloadRT.encode({
          data: patchedSourceConfiguration
        })
      });
    } catch (error) {
      var _error$statusCode2, _error$message2;

      if (_boom.default.isBoom(error)) {
        throw error;
      }

      return response.customError({
        statusCode: (_error$statusCode2 = error.statusCode) !== null && _error$statusCode2 !== void 0 ? _error$statusCode2 : 500,
        body: {
          message: (_error$message2 = error.message) !== null && _error$message2 !== void 0 ? _error$message2 : 'An unexpected error occurred'
        }
      });
    }
  }));
};

exports.initLogSourceConfigurationRoutes = initLogSourceConfigurationRoutes;