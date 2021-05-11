"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIRED_ACTIONS = exports.FIRED_ACTIONS_ID = exports.createMetricAnomalyExecutor = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _messages = require("../common/messages");

var _types = require("../common/types");

var _get_interval_in_seconds = require("../../../utils/get_interval_in_seconds");

var _evaluate_condition = require("./evaluate_condition");

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


const createMetricAnomalyExecutor = (libs, ml) => async ({
  services,
  params,
  startedAt
}) => {
  if (!ml) {
    return;
  }

  const request = {};
  const mlSystem = ml.mlSystemProvider(request, services.savedObjectsClient);
  const mlAnomalyDetectors = ml.anomalyDetectorsProvider(request, services.savedObjectsClient);
  const {
    metric,
    alertInterval,
    influencerFilter,
    sourceId,
    spaceId,
    nodeType,
    threshold
  } = params;
  const bucketInterval = (0, _get_interval_in_seconds.getIntervalInSeconds)('15m') * 1000;
  const alertIntervalInMs = (0, _get_interval_in_seconds.getIntervalInSeconds)(alertInterval !== null && alertInterval !== void 0 ? alertInterval : '1m') * 1000;
  const endTime = startedAt.getTime(); // Anomalies are bucketed at :00, :15, :30, :45 minutes every hour

  const previousBucketStartTime = endTime - endTime % bucketInterval; // If the alert interval is less than 15m, make sure that it actually queries an anomaly bucket

  const startTime = Math.min(endTime - alertIntervalInMs, previousBucketStartTime);
  const {
    data
  } = await (0, _evaluate_condition.evaluateCondition)({
    sourceId: sourceId !== null && sourceId !== void 0 ? sourceId : 'default',
    spaceId: spaceId !== null && spaceId !== void 0 ? spaceId : 'default',
    mlSystem,
    mlAnomalyDetectors,
    startTime,
    endTime,
    metric,
    threshold,
    nodeType,
    influencerFilter
  });
  const shouldAlertFire = data.length > 0;

  if (shouldAlertFire) {
    const {
      startTime: anomalyStartTime,
      anomalyScore,
      actual,
      typical,
      influencers
    } = (0, _lodash.first)(data);
    const alertInstance = services.alertInstanceFactory(`${nodeType}-${metric}`);
    alertInstance.scheduleActions(FIRED_ACTIONS_ID, {
      alertState: _messages.stateToAlertMessage[_types.AlertStates.ALERT],
      timestamp: (0, _moment.default)(anomalyStartTime).toISOString(),
      anomalyScore,
      actual,
      typical,
      metric: metricNameMap[metric],
      summary: generateSummaryMessage(actual, typical),
      influencers: influencers.join(', ')
    });
  }
};

exports.createMetricAnomalyExecutor = createMetricAnomalyExecutor;
const FIRED_ACTIONS_ID = 'metrics.anomaly.fired';
exports.FIRED_ACTIONS_ID = FIRED_ACTIONS_ID;
const FIRED_ACTIONS = {
  id: FIRED_ACTIONS_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomaly.fired', {
    defaultMessage: 'Fired'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;

const generateSummaryMessage = (actual, typical) => {
  const differential = (Math.max(actual, typical) / Math.min(actual, typical)).toFixed(1).replace('.0', '');

  if (actual > typical) {
    return _i18n.i18n.translate('xpack.infra.metrics.alerting.anomaly.summaryHigher', {
      defaultMessage: '{differential}x higher',
      values: {
        differential
      }
    });
  } else {
    return _i18n.i18n.translate('xpack.infra.metrics.alerting.anomaly.summaryLower', {
      defaultMessage: '{differential}x lower',
      values: {
        differential
      }
    });
  }
};

const metricNameMap = {
  memory_usage: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomaly.memoryUsage', {
    defaultMessage: 'Memory usage'
  }),
  network_in: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomaly.networkIn', {
    defaultMessage: 'Network in'
  }),
  network_out: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomaly.networkOut', {
    defaultMessage: 'Network out'
  })
};