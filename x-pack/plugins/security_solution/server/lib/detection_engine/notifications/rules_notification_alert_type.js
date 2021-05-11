"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rulesNotificationAlertType = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../../common/constants");

var _siem_rule_action_groups = require("../signals/siem_rule_action_groups");

var _schedule_notification_actions = require("./schedule_notification_actions");

var _utils = require("./utils");

var _parse_schedule_dates = require("../../../../common/detection_engine/parse_schedule_dates");

var _get_signals = require("./get_signals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const rulesNotificationAlertType = ({
  logger
}) => ({
  id: _constants.NOTIFICATIONS_ID,
  name: 'SIEM notification',
  actionGroups: _siem_rule_action_groups.siemRuleActionGroups,
  defaultActionGroupId: 'default',
  producer: _constants.SERVER_APP_ID,
  validate: {
    params: _configSchema.schema.object({
      ruleAlertId: _configSchema.schema.string()
    })
  },
  minimumLicenseRequired: 'basic',

  async executor({
    startedAt,
    previousStartedAt,
    alertId,
    services,
    params
  }) {
    var _parseScheduleDates, _parseScheduleDates2, _ruleAlertParams$meta;

    const ruleAlertSavedObject = await services.savedObjectsClient.get('alert', params.ruleAlertId);

    if (!ruleAlertSavedObject.attributes.params) {
      logger.error(`Saved object for alert ${params.ruleAlertId} was not found`);
      return;
    }

    const {
      params: ruleAlertParams,
      name: ruleName
    } = ruleAlertSavedObject.attributes;
    const ruleParams = { ...ruleAlertParams,
      name: ruleName,
      id: ruleAlertSavedObject.id
    };
    const fromInMs = (_parseScheduleDates = (0, _parse_schedule_dates.parseScheduleDates)(previousStartedAt ? previousStartedAt.toISOString() : `now-${ruleAlertSavedObject.attributes.schedule.interval}`)) === null || _parseScheduleDates === void 0 ? void 0 : _parseScheduleDates.format('x');
    const toInMs = (_parseScheduleDates2 = (0, _parse_schedule_dates.parseScheduleDates)(startedAt.toISOString())) === null || _parseScheduleDates2 === void 0 ? void 0 : _parseScheduleDates2.format('x');
    const results = await (0, _get_signals.getSignals)({
      from: fromInMs,
      to: toInMs,
      size: _constants.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE,
      index: ruleParams.outputIndex,
      ruleId: ruleParams.ruleId,
      callCluster: services.callCluster
    });
    const signals = results.hits.hits.map(hit => hit._source);
    const signalsCount = typeof results.hits.total === 'number' ? results.hits.total : results.hits.total.value;
    const resultsLink = (0, _utils.getNotificationResultsLink)({
      from: fromInMs,
      to: toInMs,
      id: ruleAlertSavedObject.id,
      kibanaSiemAppUrl: (_ruleAlertParams$meta = ruleAlertParams.meta) === null || _ruleAlertParams$meta === void 0 ? void 0 : _ruleAlertParams$meta.kibana_siem_app_url
    });
    logger.info(`Found ${signalsCount} signals using signal rule name: "${ruleParams.name}", id: "${params.ruleAlertId}", rule_id: "${ruleParams.ruleId}" in "${ruleParams.outputIndex}" index`);

    if (signalsCount !== 0) {
      const alertInstance = services.alertInstanceFactory(alertId);
      (0, _schedule_notification_actions.scheduleNotificationActions)({
        alertInstance,
        signalsCount,
        resultsLink,
        ruleParams,
        signals
      });
    }
  }

});

exports.rulesNotificationAlertType = rulesNotificationAlertType;