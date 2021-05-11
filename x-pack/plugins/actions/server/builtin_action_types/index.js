"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBuiltInActionTypes = registerBuiltInActionTypes;
Object.defineProperty(exports, "EmailActionParams", {
  enumerable: true,
  get: function () {
    return _email.ActionParamsType;
  }
});
Object.defineProperty(exports, "EmailActionTypeId", {
  enumerable: true,
  get: function () {
    return _email.ActionTypeId;
  }
});
Object.defineProperty(exports, "IndexActionParams", {
  enumerable: true,
  get: function () {
    return _es_index.ActionParamsType;
  }
});
Object.defineProperty(exports, "IndexActionTypeId", {
  enumerable: true,
  get: function () {
    return _es_index.ActionTypeId;
  }
});
Object.defineProperty(exports, "PagerDutyActionParams", {
  enumerable: true,
  get: function () {
    return _pagerduty.ActionParamsType;
  }
});
Object.defineProperty(exports, "PagerDutyActionTypeId", {
  enumerable: true,
  get: function () {
    return _pagerduty.ActionTypeId;
  }
});
Object.defineProperty(exports, "ServerLogActionParams", {
  enumerable: true,
  get: function () {
    return _server_log.ActionParamsType;
  }
});
Object.defineProperty(exports, "ServerLogActionTypeId", {
  enumerable: true,
  get: function () {
    return _server_log.ActionTypeId;
  }
});
Object.defineProperty(exports, "SlackActionParams", {
  enumerable: true,
  get: function () {
    return _slack.ActionParamsType;
  }
});
Object.defineProperty(exports, "SlackActionTypeId", {
  enumerable: true,
  get: function () {
    return _slack.ActionTypeId;
  }
});
Object.defineProperty(exports, "WebhookActionParams", {
  enumerable: true,
  get: function () {
    return _webhook.ActionParamsType;
  }
});
Object.defineProperty(exports, "WebhookActionTypeId", {
  enumerable: true,
  get: function () {
    return _webhook.ActionTypeId;
  }
});
Object.defineProperty(exports, "ServiceNowActionParams", {
  enumerable: true,
  get: function () {
    return _servicenow.ActionParamsType;
  }
});
Object.defineProperty(exports, "ServiceNowITSMActionTypeId", {
  enumerable: true,
  get: function () {
    return _servicenow.ServiceNowITSMActionTypeId;
  }
});
Object.defineProperty(exports, "ServiceNowSIRActionTypeId", {
  enumerable: true,
  get: function () {
    return _servicenow.ServiceNowSIRActionTypeId;
  }
});
Object.defineProperty(exports, "JiraActionParams", {
  enumerable: true,
  get: function () {
    return _jira.ActionParamsType;
  }
});
Object.defineProperty(exports, "JiraActionTypeId", {
  enumerable: true,
  get: function () {
    return _jira.ActionTypeId;
  }
});
Object.defineProperty(exports, "ResilientActionParams", {
  enumerable: true,
  get: function () {
    return _resilient.ActionParamsType;
  }
});
Object.defineProperty(exports, "ResilientActionTypeId", {
  enumerable: true,
  get: function () {
    return _resilient.ActionTypeId;
  }
});
Object.defineProperty(exports, "TeamsActionParams", {
  enumerable: true,
  get: function () {
    return _teams.ActionParamsType;
  }
});
Object.defineProperty(exports, "TeamsActionTypeId", {
  enumerable: true,
  get: function () {
    return _teams.ActionTypeId;
  }
});

var _email = require("./email");

var _es_index = require("./es_index");

var _pagerduty = require("./pagerduty");

var _server_log = require("./server_log");

var _slack = require("./slack");

var _webhook = require("./webhook");

var _servicenow = require("./servicenow");

var _jira = require("./jira");

var _resilient = require("./resilient");

var _teams = require("./teams");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerBuiltInActionTypes({
  actionsConfigUtils: configurationUtilities,
  actionTypeRegistry,
  logger,
  publicBaseUrl
}) {
  actionTypeRegistry.register((0, _email.getActionType)({
    logger,
    configurationUtilities,
    publicBaseUrl
  }));
  actionTypeRegistry.register((0, _es_index.getActionType)({
    logger
  }));
  actionTypeRegistry.register((0, _pagerduty.getActionType)({
    logger,
    configurationUtilities
  }));
  actionTypeRegistry.register((0, _server_log.getActionType)({
    logger
  }));
  actionTypeRegistry.register((0, _slack.getActionType)({
    logger,
    configurationUtilities
  }));
  actionTypeRegistry.register((0, _webhook.getActionType)({
    logger,
    configurationUtilities
  }));
  actionTypeRegistry.register((0, _servicenow.getServiceNowITSMActionType)({
    logger,
    configurationUtilities
  }));
  actionTypeRegistry.register((0, _servicenow.getServiceNowSIRActionType)({
    logger,
    configurationUtilities
  }));
  actionTypeRegistry.register((0, _jira.getActionType)({
    logger,
    configurationUtilities
  }));
  actionTypeRegistry.register((0, _resilient.getActionType)({
    logger,
    configurationUtilities
  }));
  actionTypeRegistry.register((0, _teams.getActionType)({
    logger,
    configurationUtilities
  }));
}