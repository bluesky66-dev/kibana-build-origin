"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNotifications = void 0;

var _constants = require("../../../../common/constants");

var _add_tags = require("./add_tags");

var _transform_actions = require("../../../../common/detection_engine/transform_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createNotifications = async ({
  alertsClient,
  actions,
  enabled,
  ruleAlertId,
  interval,
  name
}) => alertsClient.create({
  data: {
    name,
    tags: (0, _add_tags.addTags)([], ruleAlertId),
    alertTypeId: _constants.NOTIFICATIONS_ID,
    consumer: _constants.SERVER_APP_ID,
    params: {
      ruleAlertId
    },
    schedule: {
      interval
    },
    enabled,
    actions: actions.map(_transform_actions.transformRuleToAlertAction),
    throttle: null,
    notifyWhen: null
  }
});

exports.createNotifications = createNotifications;