"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMetricThresholdAlertType = registerMetricThresholdAlertType;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _metrics_explorer = require("../../../../common/http_api/metrics_explorer");

var _metric_threshold_executor = require("./metric_threshold_executor");

var _types = require("./types");

var _utils = require("../common/utils");

var _messages = require("../common/messages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerMetricThresholdAlertType(libs) {
  const baseCriterion = {
    threshold: _configSchema.schema.arrayOf(_configSchema.schema.number()),
    comparator: (0, _utils.oneOfLiterals)(Object.values(_types.Comparator)),
    timeUnit: _configSchema.schema.string(),
    timeSize: _configSchema.schema.number(),
    warningThreshold: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.number())),
    warningComparator: _configSchema.schema.maybe((0, _utils.oneOfLiterals)(Object.values(_types.Comparator)))
  };

  const nonCountCriterion = _configSchema.schema.object({ ...baseCriterion,
    metric: _configSchema.schema.string(),
    aggType: (0, _utils.oneOfLiterals)(_metrics_explorer.METRIC_EXPLORER_AGGREGATIONS)
  });

  const countCriterion = _configSchema.schema.object({ ...baseCriterion,
    aggType: _configSchema.schema.literal('count'),
    metric: _configSchema.schema.never()
  });

  return {
    id: _types.METRIC_THRESHOLD_ALERT_TYPE_ID,
    name: _i18n.i18n.translate('xpack.infra.metrics.alertName', {
      defaultMessage: 'Metric threshold'
    }),
    validate: {
      params: _configSchema.schema.object({
        criteria: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([countCriterion, nonCountCriterion])),
        groupBy: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
        filterQuery: _configSchema.schema.maybe(_configSchema.schema.string({
          validate: _utils.validateIsStringElasticsearchJSONFilter
        })),
        sourceId: _configSchema.schema.string(),
        alertOnNoData: _configSchema.schema.maybe(_configSchema.schema.boolean())
      }, {
        unknowns: 'allow'
      })
    },
    defaultActionGroupId: _metric_threshold_executor.FIRED_ACTIONS.id,
    actionGroups: [_metric_threshold_executor.FIRED_ACTIONS, _metric_threshold_executor.WARNING_ACTIONS],
    minimumLicenseRequired: 'basic',
    executor: (0, _metric_threshold_executor.createMetricThresholdExecutor)(libs),
    actionVariables: {
      context: [{
        name: 'group',
        description: _messages.groupActionVariableDescription
      }, {
        name: 'alertState',
        description: _messages.alertStateActionVariableDescription
      }, {
        name: 'reason',
        description: _messages.reasonActionVariableDescription
      }, {
        name: 'timestamp',
        description: _messages.timestampActionVariableDescription
      }, {
        name: 'value',
        description: _messages.valueActionVariableDescription
      }, {
        name: 'metric',
        description: _messages.metricActionVariableDescription
      }, {
        name: 'threshold',
        description: _messages.thresholdActionVariableDescription
      }]
    },
    producer: 'infrastructure'
  };
}