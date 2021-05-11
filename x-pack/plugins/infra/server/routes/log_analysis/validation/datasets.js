"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initValidateLogAnalysisDatasetsRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

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


const initValidateLogAnalysisDatasetsRoute = ({
  framework,
  logEntries
}) => {
  framework.registerRoute({
    method: 'post',
    path: _http_api.LOG_ANALYSIS_VALIDATE_DATASETS_PATH,
    validate: {
      body: (0, _runtime_types.createValidationFunction)(_http_api.validateLogEntryDatasetsRequestPayloadRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    try {
      const {
        data: {
          indices,
          timestampField,
          startTime,
          endTime
        }
      } = request.body;
      const datasets = await Promise.all(indices.map(async indexName => {
        const indexDatasets = await logEntries.getLogEntryDatasets(requestContext, timestampField, indexName, startTime, endTime);
        return {
          indexName,
          datasets: indexDatasets
        };
      }));
      return response.ok({
        body: _http_api.validateLogEntryDatasetsResponsePayloadRT.encode({
          data: {
            datasets
          }
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
};

exports.initValidateLogAnalysisDatasetsRoute = initValidateLogAnalysisDatasetsRoute;