"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readNotifications = void 0;

var _types = require("./types");

var _find_notifications = require("./find_notifications");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readNotifications = async ({
  alertsClient,
  id,
  ruleAlertId
}) => {
  if (id != null) {
    try {
      const notification = await alertsClient.get({
        id
      });

      if ((0, _types.isAlertType)(notification)) {
        return notification;
      } else {
        return null;
      }
    } catch (err) {
      var _err$output;

      if ((err === null || err === void 0 ? void 0 : (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 404) {
        return null;
      } else {
        // throw non-404 as they would be 500 or other internal errors
        throw err;
      }
    }
  } else if (ruleAlertId != null) {
    const notificationFromFind = await (0, _find_notifications.findNotifications)({
      alertsClient,
      filter: `alert.attributes.tags: "${_constants.INTERNAL_RULE_ALERT_ID_KEY}:${ruleAlertId}"`,
      page: 1
    });

    if (notificationFromFind.data.length === 0 || !(0, _types.isAlertType)(notificationFromFind.data[0])) {
      return null;
    } else {
      return notificationFromFind.data[0];
    }
  } else {
    // should never get here, and yet here we are.
    return null;
  }
};

exports.readNotifications = readNotifications;