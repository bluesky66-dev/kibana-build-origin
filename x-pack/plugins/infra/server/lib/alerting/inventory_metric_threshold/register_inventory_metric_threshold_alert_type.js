"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMetricInventoryThresholdAlertType = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _inventory_metric_threshold_executor = require("./inventory_metric_threshold_executor");

var _types = require("./types");

var _utils = require("../common/utils");

var _messages = require("../common/messages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const condition = _configSchema.schema.object({
  threshold: _configSchema.schema.arrayOf(_configSchema.schema.number()),
  comparator: (0, _utils.oneOfLiterals)(Object.values(_types.Comparator)),
  timeUnit: _configSchema.schema.string(),
  timeSize: _configSchema.schema.number(),
  metric: _configSchema.schema.string(),
  warningThreshold: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.number())),
  warningComparator: _configSchema.schema.maybe((0, _utils.oneOfLiterals)(Object.values(_types.Comparator))),
  customMetric: _configSchema.schema.maybe(_configSchema.schema.object({
    type: _configSchema.schema.literal('custom'),
    id: _configSchema.schema.string(),
    field: _configSchema.schema.string(),
    aggregation: _configSchema.schema.string(),
    label: _configSchema.schema.maybe(_configSchema.schema.string())
  }))
});

const registerMetricInventoryThresholdAlertType = libs => ({
  id: _types.METRIC_INVENTORY_THRESHOLD_ALERT_TYPE_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.inventory.alertName', {
    defaultMessage: 'Inventory'
  }),
  validate: {
    params: _configSchema.schema.object({
      criteria: _configSchema.schema.arrayOf(condition),
      nodeType: _configSchema.schema.string(),
      filterQuery: _configSchema.schema.maybe(_configSchema.schema.string({
        validate: _utils.validateIsStringElasticsearchJSONFilter
      })),
      sourceId: _configSchema.schema.string(),
      alertOnNoData: _configSchema.schema.maybe(_configSchema.schema.boolean())
    }, {
      unknowns: 'allow'
    })
  },
  defaultActionGroupId: _inventory_metric_threshold_executor.FIRED_ACTIONS_ID,
  actionGroups: [_inventory_metric_threshold_executor.FIRED_ACTIONS, _inventory_metric_threshold_executor.WARNING_ACTIONS],
  producer: 'infrastructure',
  minimumLicenseRequired: 'basic',
  executor: (0, _inventory_metric_threshold_executor.createInventoryMetricThresholdExecutor)(libs),
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
  }
});

exports.registerMetricInventoryThresholdAlertType = registerMetricInventoryThresholdAlertType;