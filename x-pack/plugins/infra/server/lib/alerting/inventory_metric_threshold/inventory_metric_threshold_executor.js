"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WARNING_ACTIONS = exports.WARNING_ACTIONS_ID = exports.FIRED_ACTIONS = exports.FIRED_ACTIONS_ID = exports.createInventoryMetricThresholdExecutor = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _get_custom_metric_label = require("../../../../common/formatters/get_custom_metric_label");

var _snapshot_metric_i18n = require("../../../../common/snapshot_metric_i18n");

var _types = require("./types");

var _common = require("../../../../../alerts/common");

var _snapshot_metric_formats = require("../../../../common/formatters/snapshot_metric_formats");

var _formatters = require("../../../../common/formatters");

var _messages = require("../common/messages");

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


const createInventoryMetricThresholdExecutor = libs => async ({
  services,
  params
}) => {
  const {
    criteria,
    filterQuery,
    sourceId,
    nodeType,
    alertOnNoData
  } = params;
  if (criteria.length === 0) throw new Error('Cannot execute an alert with 0 conditions');
  const source = await libs.sources.getSourceConfiguration(services.savedObjectsClient, sourceId || 'default');
  const results = await Promise.all(criteria.map(c => (0, _evaluate_condition.evaluateCondition)(c, nodeType, source, services.callCluster, filterQuery)));
  const inventoryItems = Object.keys((0, _lodash.first)(results));

  for (const item of inventoryItems) {
    // AND logic; all criteria must be across the threshold
    const shouldAlertFire = results.every(result => // Grab the result of the most recent bucket
    (0, _lodash.last)(result[item].shouldFire));
    const shouldAlertWarn = results.every(result => (0, _lodash.last)(result[item].shouldWarn)); // AND logic; because we need to evaluate all criteria, if one of them reports no data then the
    // whole alert is in a No Data/Error state

    const isNoData = results.some(result => (0, _lodash.last)(result[item].isNoData));
    const isError = results.some(result => result[item].isError);
    const nextState = isError ? _types.AlertStates.ERROR : isNoData ? _types.AlertStates.NO_DATA : shouldAlertFire ? _types.AlertStates.ALERT : shouldAlertWarn ? _types.AlertStates.WARNING : _types.AlertStates.OK;
    let reason;

    if (nextState === _types.AlertStates.ALERT || nextState === _types.AlertStates.WARNING) {
      reason = results.map(result => buildReasonWithVerboseMetricName(result[item], _messages.buildFiredAlertReason, nextState === _types.AlertStates.WARNING)).join('\n');
      /*
       * Custom recovery actions aren't yet available in the alerting framework
       * Uncomment the code below once they've been implemented
       * Reference: https://github.com/elastic/kibana/issues/87048
       */
      // } else if (nextState === AlertStates.OK && prevState?.alertState === AlertStates.ALERT) {
      // reason = results
      //   .map((result) => buildReasonWithVerboseMetricName(result[item], buildRecoveredAlertReason))
      //   .join('\n');
    }

    if (alertOnNoData) {
      if (nextState === _types.AlertStates.NO_DATA) {
        reason = results.filter(result => result[item].isNoData).map(result => buildReasonWithVerboseMetricName(result[item], _messages.buildNoDataAlertReason)).join('\n');
      } else if (nextState === _types.AlertStates.ERROR) {
        reason = results.filter(result => result[item].isError).map(result => buildReasonWithVerboseMetricName(result[item], _messages.buildErrorAlertReason)).join('\n');
      }
    }

    if (reason) {
      const actionGroupId = nextState === _types.AlertStates.OK ? _common.RecoveredActionGroup.id : nextState === _types.AlertStates.WARNING ? WARNING_ACTIONS.id : FIRED_ACTIONS.id;
      const alertInstance = services.alertInstanceFactory(`${item}`);
      alertInstance.scheduleActions(
      /**
       * TODO: We're lying to the compiler here as explicitly  calling `scheduleActions` on
       * the RecoveredActionGroup isn't allowed
       */
      actionGroupId, {
        group: item,
        alertState: _messages.stateToAlertMessage[nextState],
        reason,
        timestamp: (0, _moment.default)().toISOString(),
        value: mapToConditionsLookup(results, result => formatMetric(result[item].metric, result[item].currentValue)),
        threshold: mapToConditionsLookup(criteria, c => c.threshold),
        metric: mapToConditionsLookup(criteria, c => c.metric)
      });
    }
  }
};

exports.createInventoryMetricThresholdExecutor = createInventoryMetricThresholdExecutor;

const buildReasonWithVerboseMetricName = (resultItem, buildReason, useWarningThreshold) => {
  var _toMetricOpt;

  if (!resultItem) return '';
  const resultWithVerboseMetricName = { ...resultItem,
    metric: ((_toMetricOpt = (0, _snapshot_metric_i18n.toMetricOpt)(resultItem.metric)) === null || _toMetricOpt === void 0 ? void 0 : _toMetricOpt.text) || (resultItem.metric === 'custom' ? (0, _get_custom_metric_label.getCustomMetricLabel)(resultItem.customMetric) : resultItem.metric),
    currentValue: formatMetric(resultItem.metric, resultItem.currentValue),
    threshold: useWarningThreshold ? resultItem.warningThreshold : resultItem.threshold,
    comparator: useWarningThreshold ? resultItem.warningComparator : resultItem.comparator
  };
  return buildReason(resultWithVerboseMetricName);
};

const mapToConditionsLookup = (list, mapFn) => list.map(mapFn).reduce((result, value, i) => ({ ...result,
  [`condition${i}`]: value
}), {});

const FIRED_ACTIONS_ID = 'metrics.inventory_threshold.fired';
exports.FIRED_ACTIONS_ID = FIRED_ACTIONS_ID;
const FIRED_ACTIONS = {
  id: FIRED_ACTIONS_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.inventory.threshold.fired', {
    defaultMessage: 'Alert'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;
const WARNING_ACTIONS_ID = 'metrics.inventory_threshold.warning';
exports.WARNING_ACTIONS_ID = WARNING_ACTIONS_ID;
const WARNING_ACTIONS = {
  id: WARNING_ACTIONS_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.warning', {
    defaultMessage: 'Warning'
  })
};
exports.WARNING_ACTIONS = WARNING_ACTIONS;

const formatMetric = (metric, value) => {
  const metricFormatter = (0, _lodash.get)(_snapshot_metric_formats.METRIC_FORMATTERS, metric, _snapshot_metric_formats.METRIC_FORMATTERS.count);

  if (isNaN(value)) {
    return _i18n.i18n.translate('xpack.infra.metrics.alerting.inventory.noDataFormattedValue', {
      defaultMessage: '[NO DATA]'
    });
  }

  const formatter = (0, _formatters.createFormatter)(metricFormatter.formatter, metricFormatter.template);
  return formatter(value);
};