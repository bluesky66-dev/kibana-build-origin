"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMetricAnomalyAlertType = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _metric_anomaly_executor = require("./metric_anomaly_executor");

var _metrics = require("../../../../common/alerting/metrics");

var _utils = require("../common/utils");

var _messages = require("../common/messages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerMetricAnomalyAlertType = (libs, ml) => ({
  id: _metrics.METRIC_ANOMALY_ALERT_TYPE_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.anomaly.alertName', {
    defaultMessage: 'Infrastructure anomaly'
  }),
  validate: {
    params: _configSchema.schema.object({
      nodeType: (0, _utils.oneOfLiterals)(['hosts', 'k8s']),
      alertInterval: _configSchema.schema.string(),
      metric: (0, _utils.oneOfLiterals)(['memory_usage', 'network_in', 'network_out']),
      threshold: _configSchema.schema.number(),
      filterQuery: _configSchema.schema.maybe(_configSchema.schema.string({
        validate: _utils.validateIsStringElasticsearchJSONFilter
      })),
      sourceId: _configSchema.schema.string(),
      spaceId: _configSchema.schema.string()
    }, {
      unknowns: 'allow'
    })
  },
  defaultActionGroupId: _metric_anomaly_executor.FIRED_ACTIONS_ID,
  actionGroups: [_metric_anomaly_executor.FIRED_ACTIONS],
  producer: 'infrastructure',
  minimumLicenseRequired: 'basic',
  executor: (0, _metric_anomaly_executor.createMetricAnomalyExecutor)(libs, ml),
  actionVariables: {
    context: [{
      name: 'alertState',
      description: _messages.alertStateActionVariableDescription
    }, {
      name: 'metric',
      description: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomalyMetricDescription', {
        defaultMessage: 'The metric name in the specified condition.'
      })
    }, {
      name: 'timestamp',
      description: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomalyTimestampDescription', {
        defaultMessage: 'A timestamp of when the anomaly was detected.'
      })
    }, {
      name: 'anomalyScore',
      description: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomalyScoreDescription', {
        defaultMessage: 'The exact severity score of the detected anomaly.'
      })
    }, {
      name: 'actual',
      description: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomalyActualDescription', {
        defaultMessage: 'The actual value of the monitored metric at the time of the anomaly.'
      })
    }, {
      name: 'typical',
      description: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomalyTypicalDescription', {
        defaultMessage: 'The typical value of the monitored metric at the time of the anomaly.'
      })
    }, {
      name: 'summary',
      description: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomalySummaryDescription', {
        defaultMessage: 'A description of the anomaly, e.g. "2x higher."'
      })
    }, {
      name: 'influencers',
      description: _i18n.i18n.translate('xpack.infra.metrics.alerting.anomalyInfluencersDescription', {
        defaultMessage: 'A list of node names that influenced the anomaly.'
      })
    }]
  }
});

exports.registerMetricAnomalyAlertType = registerMetricAnomalyAlertType;