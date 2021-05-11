"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  separator: true,
  registerConnectors: true,
  externalServiceFormatters: true,
  createAlertsString: true,
  transformConnectorComment: true
};
exports.createAlertsString = createAlertsString;
Object.defineProperty(exports, "transformConnectorComment", {
  enumerable: true,
  get: function () {
    return _case.transformConnectorComment;
  }
});
exports.externalServiceFormatters = exports.registerConnectors = exports.separator = void 0;

var _case = require("./case");

var _itsm_formatter = require("./servicenow/itsm_formatter");

var _sir_formatter = require("./servicenow/sir_formatter");

var _external_service_formatter = require("./jira/external_service_formatter");

var _external_service_formatter2 = require("./resilient/external_service_formatter");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Separator used for creating a json parsable array from the mustache syntax that the alerting framework
 * sends.
 */

const separator = '__SEPARATOR__';
exports.separator = separator;

const registerConnectors = ({
  actionsRegisterType,
  logger,
  caseService,
  caseConfigureService,
  connectorMappingsService,
  userActionService,
  alertsService
}) => {
  actionsRegisterType((0, _case.getActionType)({
    logger,
    caseService,
    caseConfigureService,
    connectorMappingsService,
    userActionService,
    alertsService
  }));
};

exports.registerConnectors = registerConnectors;
const externalServiceFormatters = {
  '.servicenow': _itsm_formatter.serviceNowITSMExternalServiceFormatter,
  '.servicenow-sir': _sir_formatter.serviceNowSIRExternalServiceFormatter,
  '.jira': _external_service_formatter.jiraExternalServiceFormatter,
  '.resilient': _external_service_formatter2.resilientExternalServiceFormatter
};
exports.externalServiceFormatters = externalServiceFormatters;
/**
 * Creates the format that the connector's parser is expecting, it should result in something like this:
 * [{"_id":"1","_index":"index1"}__SEPARATOR__{"_id":"id2","_index":"index2"}__SEPARATOR__]
 *
 * This should only be used for testing purposes.
 */

function createAlertsString(alerts) {
  return `[${alerts.reduce((acc, alert) => {
    return `${acc}${JSON.stringify(alert)}${separator}`;
  }, '')}]`;
}