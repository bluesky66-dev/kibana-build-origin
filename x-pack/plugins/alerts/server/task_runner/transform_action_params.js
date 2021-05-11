"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformActionParams = transformActionParams;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function transformActionParams({
  actionsPlugin,
  alertId,
  actionTypeId,
  alertName,
  spaceId,
  tags,
  alertInstanceId,
  alertActionGroup,
  alertActionSubgroup,
  alertActionGroupName,
  context,
  actionParams,
  state,
  kibanaBaseUrl,
  alertParams
}) {
  // when the list of variables we pass in here changes,
  // the UI will need to be updated as well; see:
  // x-pack/plugins/triggers_actions_ui/public/application/lib/action_variables.ts
  const variables = {
    alertId,
    alertName,
    spaceId,
    tags,
    alertInstanceId,
    alertActionGroup,
    alertActionGroupName,
    alertActionSubgroup,
    context,
    date: new Date().toISOString(),
    state,
    kibanaBaseUrl,
    params: alertParams
  };
  return actionsPlugin.renderActionParameterTemplates(actionTypeId, actionParams, variables);
}