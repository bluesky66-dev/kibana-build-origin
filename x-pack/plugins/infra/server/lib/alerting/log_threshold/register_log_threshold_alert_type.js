"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLogThresholdAlertType = registerLogThresholdAlertType;

var _i18n = require("@kbn/i18n");

var _log_threshold_executor = require("./log_threshold_executor");

var _types = require("../../../../common/alerting/logs/log_threshold/types");

var _runtime_types = require("../../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const timestampActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.timestampActionVariableDescription', {
  defaultMessage: 'UTC timestamp of when the alert was triggered'
});

const documentCountActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.documentCountActionVariableDescription', {
  defaultMessage: 'The number of log entries that matched the conditions provided'
});

const conditionsActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.conditionsActionVariableDescription', {
  defaultMessage: 'The conditions that log entries needed to fulfill'
});

const groupByActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.groupByActionVariableDescription', {
  defaultMessage: 'The name of the group responsible for triggering the alert'
});

const isRatioActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.isRatioActionVariableDescription', {
  defaultMessage: 'Denotes whether this alert was configured with a ratio'
});

const ratioActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.ratioActionVariableDescription', {
  defaultMessage: 'The ratio value of the two sets of criteria'
});

const numeratorConditionsActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.numeratorConditionsActionVariableDescription', {
  defaultMessage: 'The conditions that the numerator of the ratio needed to fulfill'
});

const denominatorConditionsActionVariableDescription = _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.denominatorConditionsActionVariableDescription', {
  defaultMessage: 'The conditions that the denominator of the ratio needed to fulfill'
});

async function registerLogThresholdAlertType(alertingPlugin, libs) {
  if (!alertingPlugin) {
    throw new Error('Cannot register log threshold alert type.  Both the actions and alerting plugins need to be enabled.');
  }

  alertingPlugin.registerType({
    id: _types.LOG_DOCUMENT_COUNT_ALERT_TYPE_ID,
    name: _i18n.i18n.translate('xpack.infra.logs.alertName', {
      defaultMessage: 'Log threshold'
    }),
    validate: {
      params: {
        validate: params => (0, _runtime_types.decodeOrThrow)(_types.alertParamsRT)(params)
      }
    },
    defaultActionGroupId: _log_threshold_executor.FIRED_ACTIONS.id,
    actionGroups: [_log_threshold_executor.FIRED_ACTIONS],
    minimumLicenseRequired: 'basic',
    executor: (0, _log_threshold_executor.createLogThresholdExecutor)(libs),
    actionVariables: {
      context: [{
        name: 'timestamp',
        description: timestampActionVariableDescription
      }, {
        name: 'matchingDocuments',
        description: documentCountActionVariableDescription
      }, {
        name: 'conditions',
        description: conditionsActionVariableDescription
      }, {
        name: 'group',
        description: groupByActionVariableDescription
      }, // Ratio alerts
      {
        name: 'isRatio',
        description: isRatioActionVariableDescription
      }, {
        name: 'ratio',
        description: ratioActionVariableDescription
      }, {
        name: 'numeratorConditions',
        description: numeratorConditionsActionVariableDescription
      }, {
        name: 'denominatorConditions',
        description: denominatorConditionsActionVariableDescription
      }]
    },
    producer: 'logs'
  });
}