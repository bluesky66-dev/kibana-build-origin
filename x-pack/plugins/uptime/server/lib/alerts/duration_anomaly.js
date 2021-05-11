"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.durationAnomalyAlertFactory = exports.getAnomalySummary = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _configSchema = require("@kbn/config-schema");

var _common = require("./common");

var _alerts = require("../../../common/constants/alerts");

var _translations = require("./translations");

var _anomaly_utils = require("../../../../ml/common/util/anomaly_utils");

var _lib = require("../../../common/lib");

var _get_latest_monitor = require("../requests/get_latest_monitor");

var _uptime_alert_wrapper = require("./uptime_alert_wrapper");

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


const getAnomalySummary = (anomaly, monitorInfo) => {
  var _monitorInfo$url;

  return {
    severity: (0, _anomaly_utils.getSeverityType)(anomaly.severity),
    severityScore: Math.round(anomaly.severity),
    anomalyStartTimestamp: (0, _moment.default)(anomaly.source.timestamp).toISOString(),
    monitor: anomaly.source['monitor.id'],
    monitorUrl: (_monitorInfo$url = monitorInfo.url) === null || _monitorInfo$url === void 0 ? void 0 : _monitorInfo$url.full,
    slowestAnomalyResponse: Math.round(anomaly.actualSort / 1000) + ' ms',
    expectedResponseTime: Math.round(anomaly.typicalSort / 1000) + ' ms',
    observerLocation: anomaly.entityValue
  };
};

exports.getAnomalySummary = getAnomalySummary;

const getAnomalies = async (plugins, savedObjectsClient, params, lastCheckedAt) => {
  const fakeRequest = {};
  const {
    getAnomaliesTableData
  } = plugins.ml.resultsServiceProvider(fakeRequest, savedObjectsClient);
  return await getAnomaliesTableData([(0, _lib.getMLJobId)(params.monitorId)], [], [], 'auto', params.severity, (0, _moment.default)(lastCheckedAt).valueOf(), (0, _moment.default)().valueOf(), Intl.DateTimeFormat().resolvedOptions().timeZone, 500, 10, undefined);
};

const durationAnomalyAlertFactory = (_server, _libs, plugins) => (0, _uptime_alert_wrapper.uptimeAlertWrapper)({
  id: 'xpack.uptime.alerts.durationAnomaly',
  name: _translations.durationAnomalyTranslations.alertFactoryName,
  validate: {
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      severity: _configSchema.schema.number()
    })
  },
  defaultActionGroupId: _alerts.DURATION_ANOMALY.id,
  actionGroups: [{
    id: _alerts.DURATION_ANOMALY.id,
    name: _alerts.DURATION_ANOMALY.name
  }],
  actionVariables: {
    context: [],
    state: [..._translations.durationAnomalyTranslations.actionVariables, ..._translations.commonStateTranslations]
  },
  minimumLicenseRequired: 'basic',

  async executor({
    options,
    uptimeEsClient,
    savedObjectsClient,
    dynamicSettings
  }) {
    var _await$getAnomalies;

    const {
      services: {
        alertInstanceFactory
      },
      state,
      params
    } = options;
    const {
      anomalies
    } = (_await$getAnomalies = await getAnomalies(plugins, savedObjectsClient, params, state.lastCheckedAt)) !== null && _await$getAnomalies !== void 0 ? _await$getAnomalies : {};
    const foundAnomalies = (anomalies === null || anomalies === void 0 ? void 0 : anomalies.length) > 0;

    if (foundAnomalies) {
      const monitorInfo = await (0, _get_latest_monitor.getLatestMonitor)({
        uptimeEsClient,
        dateStart: 'now-15m',
        dateEnd: 'now',
        monitorId: params.monitorId
      });
      anomalies.forEach((anomaly, index) => {
        const alertInstance = alertInstanceFactory(_alerts.DURATION_ANOMALY.id + index);
        const summary = getAnomalySummary(anomaly, monitorInfo);
        alertInstance.replaceState({ ...(0, _common.updateState)(state, false),
          ...summary
        });
        alertInstance.scheduleActions(_alerts.DURATION_ANOMALY.id);
      });
    }

    return (0, _common.updateState)(state, foundAnomalies);
  }

});

exports.durationAnomalyAlertFactory = durationAnomalyAlertFactory;