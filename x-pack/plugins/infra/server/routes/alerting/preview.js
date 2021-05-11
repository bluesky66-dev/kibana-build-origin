"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAlertPreviewRoute = void 0;

var _metrics = require("../../../common/alerting/metrics");

var _runtime_types = require("../../../common/runtime_types");

var _preview_inventory_metric_threshold_alert = require("../../lib/alerting/inventory_metric_threshold/preview_inventory_metric_threshold_alert");

var _preview_metric_threshold_alert = require("../../lib/alerting/metric_threshold/preview_metric_threshold_alert");

var _preview_metric_anomaly_alert = require("../../lib/alerting/metric_anomaly/preview_metric_anomaly_alert");

var _request_context = require("../../utils/request_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initAlertPreviewRoute = ({
  framework,
  sources
}) => {
  const {
    callWithRequest
  } = framework;
  framework.registerRoute({
    method: 'post',
    path: _metrics.INFRA_ALERT_PREVIEW_PATH,
    validate: {
      body: (0, _runtime_types.createValidationFunction)(_metrics.alertPreviewRequestParamsRT)
    }
  }, framework.router.handleLegacyErrors(async (requestContext, request, response) => {
    const {
      lookback,
      sourceId,
      alertType,
      alertInterval,
      alertThrottle,
      alertOnNoData,
      alertNotifyWhen
    } = request.body;

    const callCluster = (endpoint, opts) => {
      return callWithRequest(requestContext, endpoint, opts);
    };

    const source = await sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId || 'default');

    try {
      switch (alertType) {
        case _metrics.METRIC_THRESHOLD_ALERT_TYPE_ID:
          {
            const {
              groupBy,
              criteria,
              filterQuery
            } = request.body;
            const previewResult = await (0, _preview_metric_threshold_alert.previewMetricThresholdAlert)({
              callCluster,
              params: {
                criteria,
                filterQuery,
                groupBy
              },
              lookback,
              config: source.configuration,
              alertInterval,
              alertThrottle,
              alertNotifyWhen,
              alertOnNoData
            });
            const payload = processPreviewResults(previewResult);
            return response.ok({
              body: _metrics.alertPreviewSuccessResponsePayloadRT.encode(payload)
            });
          }

        case _metrics.METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID:
          {
            const {
              nodeType,
              criteria,
              filterQuery
            } = request.body;
            const previewResult = await (0, _preview_inventory_metric_threshold_alert.previewInventoryMetricThresholdAlert)({
              callCluster,
              params: {
                criteria,
                filterQuery,
                nodeType
              },
              lookback,
              source,
              alertInterval,
              alertThrottle,
              alertNotifyWhen,
              alertOnNoData
            });
            const payload = processPreviewResults(previewResult);
            return response.ok({
              body: _metrics.alertPreviewSuccessResponsePayloadRT.encode(payload)
            });
          }

        case _metrics.METRIC_ANOMALY_ALERT_TYPE_ID:
          {
            (0, _request_context.assertHasInfraMlPlugins)(requestContext);
            const {
              nodeType,
              metric,
              threshold,
              influencerFilter
            } = request.body;
            const {
              mlAnomalyDetectors,
              mlSystem,
              spaceId
            } = requestContext.infra;
            const previewResult = await (0, _preview_metric_anomaly_alert.previewMetricAnomalyAlert)({
              mlAnomalyDetectors,
              mlSystem,
              spaceId,
              params: {
                nodeType,
                metric,
                threshold,
                influencerFilter
              },
              lookback,
              sourceId: source.id,
              alertInterval,
              alertThrottle,
              alertOnNoData,
              alertNotifyWhen
            });
            return response.ok({
              body: _metrics.alertPreviewSuccessResponsePayloadRT.encode({
                numberOfGroups: 1,
                resultTotals: { ...previewResult,
                  error: 0,
                  noData: 0
                }
              })
            });
          }

        default:
          throw new Error('Unknown alert type');
      }
    } catch (error) {
      var _error$statusCode, _error$message;

      if (error.message.includes(_metrics.TOO_MANY_BUCKETS_PREVIEW_EXCEPTION)) {
        return response.customError({
          statusCode: 508,
          body: {
            message: error.message.split(':')[1] // Extract the max buckets from the error message

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

exports.initAlertPreviewRoute = initAlertPreviewRoute;

const processPreviewResults = previewResult => {
  const numberOfGroups = previewResult.length;
  const resultTotals = previewResult.reduce((totals, {
    fired,
    warning,
    noData,
    error,
    notifications
  }) => {
    return { ...totals,
      fired: totals.fired + fired,
      warning: totals.warning + warning,
      noData: totals.noData + noData,
      error: totals.error + error,
      notifications: totals.notifications + notifications
    };
  }, {
    fired: 0,
    warning: 0,
    noData: 0,
    error: 0,
    notifications: 0
  });
  return {
    numberOfGroups,
    resultTotals
  };
};