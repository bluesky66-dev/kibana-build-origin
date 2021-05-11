"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateNotifications = void 0;

var _read_notifications = require("./read_notifications");

var _add_tags = require("./add_tags");

var _create_notifications = require("./create_notifications");

var _transform_actions = require("../../../../common/detection_engine/transform_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateNotifications = async ({
  alertsClient,
  actions,
  enabled,
  ruleAlertId,
  name,
  interval
}) => {
  const notification = await (0, _read_notifications.readNotifications)({
    alertsClient,
    id: undefined,
    ruleAlertId
  });

  if (interval && notification) {
    return alertsClient.update({
      id: notification.id,
      data: {
        tags: (0, _add_tags.addTags)([], ruleAlertId),
        name,
        schedule: {
          interval
        },
        actions: actions.map(_transform_actions.transformRuleToAlertAction),
        params: {
          ruleAlertId
        },
        throttle: null,
        notifyWhen: null
      }
    });
  } else if (interval && !notification) {
    return (0, _create_notifications.createNotifications)({
      alertsClient,
      enabled,
      name,
      interval,
      actions,
      ruleAlertId
    });
  } else if (!interval && notification) {
    await alertsClient.delete({
      id: notification.id
    });
    return null;
  } else {
    return null;
  }
};

exports.updateNotifications = updateNotifications;