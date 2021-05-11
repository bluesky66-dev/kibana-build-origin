"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertType = getAlertType;
exports.ID = void 0;

var _i18n = require("@kbn/i18n");

var _alert_type_params = require("./alert_type_params");

var _action_context = require("./action_context");

var _common = require("../../../common");

var _server = require("../../../../triggers_actions_ui/server");

var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ID = '.index-threshold';
exports.ID = ID;
const ActionGroupId = 'threshold met';

function getAlertType(logger, data) {
  const alertTypeName = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.alertTypeTitle', {
    defaultMessage: 'Index threshold'
  });

  const actionGroupName = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionGroupThresholdMetTitle', {
    defaultMessage: 'Threshold met'
  });

  const actionVariableContextGroupLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextGroupLabel', {
    defaultMessage: 'The group that exceeded the threshold.'
  });

  const actionVariableContextDateLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextDateLabel', {
    defaultMessage: 'The date the alert exceeded the threshold.'
  });

  const actionVariableContextValueLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextValueLabel', {
    defaultMessage: 'The value that exceeded the threshold.'
  });

  const actionVariableContextMessageLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextMessageLabel', {
    defaultMessage: 'A pre-constructed message for the alert.'
  });

  const actionVariableContextTitleLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextTitleLabel', {
    defaultMessage: 'A pre-constructed title for the alert.'
  });

  const actionVariableContextThresholdLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextThresholdLabel', {
    defaultMessage: "An array of values to use as the threshold; 'between' and 'notBetween' require two values, the others require one."
  });

  const actionVariableContextThresholdComparatorLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextThresholdComparatorLabel', {
    defaultMessage: 'A comparison function to use to determine if the threshold as been met.'
  });

  const actionVariableContextConditionsLabel = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.actionVariableContextConditionsLabel', {
    defaultMessage: 'A string describing the threshold comparator and threshold'
  });

  const alertParamsVariables = Object.keys(_server.CoreQueryParamsSchemaProperties).map(propKey => {
    return {
      name: propKey,
      description: propKey
    };
  });
  return {
    id: ID,
    name: alertTypeName,
    actionGroups: [{
      id: ActionGroupId,
      name: actionGroupName
    }],
    defaultActionGroupId: ActionGroupId,
    validate: {
      params: _alert_type_params.ParamsSchema
    },
    actionVariables: {
      context: [{
        name: 'message',
        description: actionVariableContextMessageLabel
      }, {
        name: 'title',
        description: actionVariableContextTitleLabel
      }, {
        name: 'group',
        description: actionVariableContextGroupLabel
      }, {
        name: 'date',
        description: actionVariableContextDateLabel
      }, {
        name: 'value',
        description: actionVariableContextValueLabel
      }, {
        name: 'conditions',
        description: actionVariableContextConditionsLabel
      }],
      params: [{
        name: 'threshold',
        description: actionVariableContextThresholdLabel
      }, {
        name: 'thresholdComparator',
        description: actionVariableContextThresholdComparatorLabel
      }, ...alertParamsVariables]
    },
    minimumLicenseRequired: 'basic',
    executor,
    producer: _common.STACK_ALERTS_FEATURE_ID
  };

  async function executor(options) {
    const {
      alertId,
      name,
      services,
      params
    } = options;

    const compareFn = _lib.ComparatorFns.get(params.thresholdComparator);

    if (compareFn == null) {
      throw new Error(_i18n.i18n.translate('xpack.stackAlerts.indexThreshold.invalidComparatorErrorMessage', {
        defaultMessage: 'invalid thresholdComparator specified: {comparator}',
        values: {
          comparator: params.thresholdComparator
        }
      }));
    }

    const callCluster = services.callCluster;
    const date = new Date().toISOString(); // the undefined values below are for config-schema optional types

    const queryParams = {
      index: params.index,
      timeField: params.timeField,
      aggType: params.aggType,
      aggField: params.aggField,
      groupBy: params.groupBy,
      termField: params.termField,
      termSize: params.termSize,
      dateStart: date,
      dateEnd: date,
      timeWindowSize: params.timeWindowSize,
      timeWindowUnit: params.timeWindowUnit,
      interval: undefined
    }; // console.log(`index_threshold: query: ${JSON.stringify(queryParams, null, 4)}`);

    const result = await (await data).timeSeriesQuery({
      logger,
      callCluster,
      query: queryParams
    });
    logger.debug(`alert ${ID}:${alertId} "${name}" query result: ${JSON.stringify(result)}`);
    const groupResults = result.results || []; // console.log(`index_threshold: response: ${JSON.stringify(groupResults, null, 4)}`);

    for (const groupResult of groupResults) {
      const instanceId = groupResult.group;
      const value = groupResult.metrics[0][1];
      const met = compareFn(value, params.threshold);
      if (!met) continue;
      const agg = params.aggField ? `${params.aggType}(${params.aggField})` : `${params.aggType}`;
      const humanFn = `${agg} is ${(0, _lib.getHumanReadableComparator)(params.thresholdComparator)} ${params.threshold.join(' and ')}`;
      const baseContext = {
        date,
        group: instanceId,
        value,
        conditions: humanFn
      };
      const actionContext = (0, _action_context.addMessages)(options, baseContext, params);
      const alertInstance = options.services.alertInstanceFactory(instanceId);
      alertInstance.scheduleActions(ActionGroupId, actionContext);
      logger.debug(`scheduled actionGroup: ${JSON.stringify(actionContext)}`);
    }
  }
}