"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExecutionHandler = createExecutionHandler;

var _transform_action_params = require("./transform_action_params");

var _server = require("../../../actions/server");

var _server2 = require("../../../event_log/server");

var _plugin = require("../plugin");

var _inject_action_params = require("./inject_action_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createExecutionHandler({
  logger,
  alertId,
  alertName,
  tags,
  actionsPlugin,
  actions: alertActions,
  spaceId,
  apiKey,
  alertType,
  kibanaBaseUrl,
  eventLogger,
  request,
  alertParams
}) {
  const alertTypeActionGroups = new Map(alertType.actionGroups.map(actionGroup => [actionGroup.id, actionGroup.name]));
  return async ({
    actionGroup,
    actionSubgroup,
    context,
    state,
    alertInstanceId
  }) => {
    if (!alertTypeActionGroups.has(actionGroup)) {
      logger.error(`Invalid action group "${actionGroup}" for alert "${alertType.id}".`);
      return;
    }

    const actions = alertActions.filter(({
      group
    }) => group === actionGroup).map(action => {
      return { ...action,
        params: (0, _transform_action_params.transformActionParams)({
          actionsPlugin,
          alertId,
          actionTypeId: action.actionTypeId,
          alertName,
          spaceId,
          tags,
          alertInstanceId,
          alertActionGroup: actionGroup,
          alertActionGroupName: alertTypeActionGroups.get(actionGroup),
          alertActionSubgroup: actionSubgroup,
          context,
          actionParams: action.params,
          state,
          kibanaBaseUrl,
          alertParams
        })
      };
    }).map(action => ({ ...action,
      params: (0, _inject_action_params.injectActionParams)({
        alertId,
        actionParams: action.params,
        actionTypeId: action.actionTypeId
      })
    }));
    const alertLabel = `${alertType.id}:${alertId}: '${alertName}'`;

    for (const action of actions) {
      if (!actionsPlugin.isActionExecutable(action.id, action.actionTypeId, {
        notifyUsage: true
      })) {
        logger.warn(`Alert "${alertId}" skipped scheduling action "${action.id}" because it is disabled`);
        continue;
      } // TODO would be nice  to add the action name here, but it's not available


      const actionLabel = `${action.actionTypeId}:${action.id}`;
      const actionsClient = await actionsPlugin.getActionsClientWithRequest(request);
      await actionsClient.enqueueExecution({
        id: action.id,
        params: action.params,
        spaceId,
        apiKey: apiKey !== null && apiKey !== void 0 ? apiKey : null,
        source: (0, _server.asSavedObjectExecutionSource)({
          id: alertId,
          type: 'alert'
        })
      });
      const namespace = spaceId === 'default' ? {} : {
        namespace: spaceId
      };
      const event = {
        event: {
          action: _plugin.EVENT_LOG_ACTIONS.executeAction
        },
        kibana: {
          alerting: {
            instance_id: alertInstanceId,
            action_group_id: actionGroup,
            action_subgroup: actionSubgroup
          },
          saved_objects: [{
            rel: _server2.SAVED_OBJECT_REL_PRIMARY,
            type: 'alert',
            id: alertId,
            ...namespace
          }, {
            type: 'action',
            id: action.id,
            ...namespace
          }]
        }
      };
      event.message = `alert: ${alertLabel} instanceId: '${alertInstanceId}' scheduled ${actionSubgroup ? `actionGroup(subgroup): '${actionGroup}(${actionSubgroup})'` : `actionGroup: '${actionGroup}'`} action: ${actionLabel}`;
      eventLogger.logEvent(event);
    }
  };
}