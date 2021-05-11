"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformAlertToRuleAction = exports.transformRuleToAlertAction = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformRuleToAlertAction = ({
  group,
  id,
  action_type_id,
  // eslint-disable-line @typescript-eslint/naming-convention
  params
}) => ({
  group,
  id,
  params,
  actionTypeId: action_type_id
});

exports.transformRuleToAlertAction = transformRuleToAlertAction;

const transformAlertToRuleAction = ({
  group,
  id,
  actionTypeId,
  params
}) => ({
  group,
  id,
  params,
  action_type_id: actionTypeId
});

exports.transformAlertToRuleAction = transformAlertToRuleAction;