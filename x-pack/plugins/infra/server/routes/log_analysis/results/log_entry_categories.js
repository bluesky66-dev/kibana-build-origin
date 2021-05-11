"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetLogEntryCategoriesRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _log_analysis = require("../../../../common/http_api/log_analysis");

var _runtime_types = require("../../../../common/runtime_types");

var _log_analysis2 = require("../../../lib/log_analysis");

var _request_context = require("../../../utils/request_context");

var _errors = require("../../../lib/log_analysis/errors");

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


const initGetLogEntryCategoriesRoute = ({
  framework
}) => {
  framework.registerRoute({
    method: 'post',
    path: _log_analysis.LOG_ANALYSIS_GET_LOG_ENTRY_CATEGORIES_PATH,
    validate: {
      body: (0, _runtime_types.createValidationFunction)(_log_analysis.getLogEntryCategoriesRequestPayloadRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      data: {
        categoryCount,
        histograms,
        sourceId,
        timeRange: {
          startTime,
          endTime
        },
        datasets,
        sort
      }
    } = request.body;

    try {
      (0, _request_context.assertHasInfraMlPlugins)(requestContext);
      const {
        data: topLogEntryCategories,
        timing
      } = await (0, _log_analysis2.getTopLogEntryCategories)(requestContext, sourceId, startTime, endTime, categoryCount, datasets !== null && datasets !== void 0 ? datasets : [], histograms.map(histogram => ({
        bucketCount: histogram.bucketCount,
        endTime: histogram.timeRange.endTime,
        id: histogram.id,
        startTime: histogram.timeRange.startTime
      })), sort);
      return response.ok({
        body: _log_analysis.getLogEntryCategoriesSuccessReponsePayloadRT.encode({
          data: {
            categories: topLogEntryCategories
          },
          timing
        })
      });
    } catch (error) {
      var _error$statusCode, _error$message;

      if (_boom.default.isBoom(error)) {
        throw error;
      }

      if ((0, _errors.isMlPrivilegesError)(error)) {
        return response.customError({
          statusCode: 403,
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
};

exports.initGetLogEntryCategoriesRoute = initGetLogEntryCategoriesRoute;