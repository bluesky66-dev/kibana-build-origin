"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Settings = void 0;

var _lodash = require("lodash");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isEnabledByDefault(actionType) {
  switch (actionType) {
    case _constants.ACTION_TYPES.WEBHOOK:
    case _constants.ACTION_TYPES.INDEX:
    case _constants.ACTION_TYPES.LOGGING:
      return true;

    default:
      return false;
  }
}

function requiresAccountInfo(actionType) {
  switch (actionType) {
    case _constants.ACTION_TYPES.EMAIL:
    case _constants.ACTION_TYPES.SLACK:
    case _constants.ACTION_TYPES.JIRA:
    case _constants.ACTION_TYPES.PAGERDUTY:
      return true;

    default:
      return false;
  }
}

function getAccounts({
  account,
  default_account: defaultAccount
}) {
  if (!Boolean(account)) {
    return undefined;
  }

  return Object.keys(account).reduce((accounts, accountName) => {
    accounts[accountName] = {};

    if (accountName === defaultAccount) {
      accounts[accountName].default = true;
    }

    return accounts;
  }, {});
}

function getNotifications(json) {
  if (!json) {
    return {};
  }

  return Object.values(json).reduce((accum, value) => {
    if (value.hasOwnProperty('xpack') && value.xpack.hasOwnProperty('notification')) {
      accum = (0, _lodash.merge)(accum, value.xpack.notification);
    }

    return accum;
  }, {});
}

function getActionTypesSettings(upstreamJson) {
  const upstreamActionTypes = getNotifications(upstreamJson); // Initialize settings for known action types

  const actionTypes = Object.keys(_constants.ACTION_TYPES).reduce((types, typeName) => {
    const actionType = _constants.ACTION_TYPES[typeName];

    if (actionType === _constants.ACTION_TYPES.UNKNOWN) {
      return types;
    }

    const actionTypeData = {
      enabled: isEnabledByDefault(actionType)
    }; // For actions types requiring setup, mark them as enabled
    // if upstream response contains them, indicating that they
    // are setup

    if (upstreamActionTypes.hasOwnProperty(actionType)) {
      // If it exists in the upstream response, it's enabled
      actionTypeData.enabled = true; // Add account info if applicable

      if (requiresAccountInfo(actionType)) {
        actionTypeData.accounts = getAccounts(upstreamActionTypes[actionType]);

        if (!Boolean(actionTypeData.accounts)) {
          actionTypeData.enabled = false;
        }
      }
    }

    types[actionType] = actionTypeData;
    return types;
  }, {});
  return actionTypes;
}

class Settings {
  constructor(props) {
    this.actionTypes = props.actionTypes;
  }

  get downstreamJson() {
    const result = {
      action_types: this.actionTypes
    };
    return result;
  }

  static fromUpstreamJson(json) {
    const actionTypes = getActionTypesSettings(json);
    const props = {
      actionTypes
    };
    return new Settings(props);
  }

}

exports.Settings = Settings;