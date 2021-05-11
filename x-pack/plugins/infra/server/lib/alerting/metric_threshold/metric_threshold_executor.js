"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WARNING_ACTIONS = exports.FIRED_ACTIONS = exports.createMetricThresholdExecutor = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _common = require("../../../../../alerts/common");

var _messages = require("../common/messages");

var _formatters = require("../../../../common/formatters");

var _types = require("./types");

var _evaluate_alert = require("./lib/evaluate_alert");

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


const createMetricThresholdExecutor = libs => async function (options) {
  const {
    services,
    params
  } = options;
  const {
    criteria
  } = params;
  if (criteria.length === 0) throw new Error('Cannot execute an alert with 0 conditions');
  const {
    sourceId,
    alertOnNoData
  } = params;
  const source = await libs.sources.getSourceConfiguration(services.savedObjectsClient, sourceId || 'default');
  const config = source.configuration;
  const alertResults = await (0, _evaluate_alert.evaluateAlert)(services.callCluster, params, config); // Because each alert result has the same group definitions, just grab the groups from the first one.

  const groups = Object.keys((0, _lodash.first)(alertResults));

  for (const group of groups) {
    // AND logic; all criteria must be across the threshold
    const shouldAlertFire = alertResults.every(result => // Grab the result of the most recent bucket
    (0, _lodash.last)(result[group].shouldFire));
    const shouldAlertWarn = alertResults.every(result => (0, _lodash.last)(result[group].shouldWarn)); // AND logic; because we need to evaluate all criteria, if one of them reports no data then the
    // whole alert is in a No Data/Error state

    const isNoData = alertResults.some(result => (0, _lodash.last)(result[group].isNoData));
    const isError = alertResults.some(result => result[group].isError);
    const nextState = isError ? _types.AlertStates.ERROR : isNoData ? _types.AlertStates.NO_DATA : shouldAlertFire ? _types.AlertStates.ALERT : shouldAlertWarn ? _types.AlertStates.WARNING : _types.AlertStates.OK;
    let reason;

    if (nextState === _types.AlertStates.ALERT || nextState === _types.AlertStates.WARNING) {
      reason = alertResults.map(result => (0, _messages.buildFiredAlertReason)(formatAlertResult(result[group], nextState === _types.AlertStates.WARNING))).join('\n');
      /*
       * Custom recovery actions aren't yet available in the alerting framework
       * Uncomment the code below once they've been implemented
       * Reference: https://github.com/elastic/kibana/issues/87048
       */
      // } else if (nextState === AlertStates.OK && prevState?.alertState === AlertStates.ALERT) {
      // reason = alertResults
      //   .map((result) => buildRecoveredAlertReason(formatAlertResult(result[group])))
      //   .join('\n');
    }

    if (alertOnNoData) {
      if (nextState === _types.AlertStates.NO_DATA) {
        reason = alertResults.filter(result => result[group].isNoData).map(result => (0, _messages.buildNoDataAlertReason)(result[group])).join('\n');
      } else if (nextState === _types.AlertStates.ERROR) {
        reason = alertResults.filter(result => result[group].isError).map(result => (0, _messages.buildErrorAlertReason)(result[group].metric)).join('\n');
      }
    }

    if (reason) {
      var _ref;

      const firstResult = (0, _lodash.first)(alertResults);
      const timestamp = (_ref = firstResult && firstResult[group].timestamp) !== null && _ref !== void 0 ? _ref : (0, _moment.default)().toISOString();
      const actionGroupId = nextState === _types.AlertStates.OK ? _common.RecoveredActionGroup.id : nextState === _types.AlertStates.WARNING ? WARNING_ACTIONS.id : FIRED_ACTIONS.id;
      const alertInstance = services.alertInstanceFactory(`${group}`);
      alertInstance.scheduleActions(actionGroupId, {
        group,
        alertState: _messages.stateToAlertMessage[nextState],
        reason,
        timestamp,
        value: mapToConditionsLookup(alertResults, result => formatAlertResult(result[group]).currentValue),
        threshold: mapToConditionsLookup(alertResults, result => formatAlertResult(result[group]).threshold),
        metric: mapToConditionsLookup(criteria, c => c.metric)
      });
    }
  }
};

exports.createMetricThresholdExecutor = createMetricThresholdExecutor;
const FIRED_ACTIONS = {
  id: 'metrics.threshold.fired',
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.fired', {
    defaultMessage: 'Alert'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;
const WARNING_ACTIONS = {
  id: 'metrics.threshold.warning',
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.warning', {
    defaultMessage: 'Warning'
  })
};
exports.WARNING_ACTIONS = WARNING_ACTIONS;

const mapToConditionsLookup = (list, mapFn) => list.map(mapFn).reduce((result, value, i) => ({ ...result,
  [`condition${i}`]: value
}), {});

const formatAlertResult = (alertResult, useWarningThreshold) => {
  const {
    metric,
    currentValue,
    threshold,
    comparator,
    warningThreshold,
    warningComparator
  } = alertResult;

  const noDataValue = _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.noDataFormattedValue', {
    defaultMessage: '[NO DATA]'
  });

  if (!metric.endsWith('.pct')) return { ...alertResult,
    currentValue: currentValue !== null && currentValue !== void 0 ? currentValue : noDataValue
  };
  const formatter = (0, _formatters.createFormatter)('percent');
  const thresholdToFormat = useWarningThreshold ? warningThreshold : threshold;
  const comparatorToFormat = useWarningThreshold ? warningComparator : comparator;
  return { ...alertResult,
    currentValue: currentValue !== null && typeof currentValue !== 'undefined' ? formatter(currentValue) : noDataValue,
    threshold: Array.isArray(thresholdToFormat) ? thresholdToFormat.map(v => formatter(v)) : thresholdToFormat,
    comparator: comparatorToFormat
  };
};