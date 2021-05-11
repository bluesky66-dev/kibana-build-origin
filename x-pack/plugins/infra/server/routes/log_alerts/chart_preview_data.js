"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetLogAlertsChartPreviewDataRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _chart_preview_data = require("../../../common/http_api/log_alerts/chart_preview_data");

var _runtime_types = require("../../../common/runtime_types");

var _log_threshold_chart_preview = require("../../lib/alerting/log_threshold/log_threshold_chart_preview");

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


const initGetLogAlertsChartPreviewDataRoute = ({
  framework,
  sources
}) => {
  framework.registerRoute({
    method: 'post',
    path: _chart_preview_data.LOG_ALERTS_CHART_PREVIEW_DATA_PATH,
    validate: {
      body: (0, _runtime_types.createValidationFunction)(_chart_preview_data.getLogAlertsChartPreviewDataRequestPayloadRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      data: {
        sourceId,
        buckets,
        alertParams
      }
    } = request.body;
    const sourceConfiguration = await sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);

    try {
      const {
        series
      } = await (0, _log_threshold_chart_preview.getChartPreviewData)(requestContext, sourceConfiguration, framework.callWithRequest, alertParams, buckets);
      return response.ok({
        body: _chart_preview_data.getLogAlertsChartPreviewDataSuccessResponsePayloadRT.encode({
          data: {
            series
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

exports.initGetLogAlertsChartPreviewDataRoute = initGetLogAlertsChartPreviewDataRoute;