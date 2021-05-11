"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SELECT_URGENCY = exports.SELECT_SN = exports.SELECT_SEVERITY = exports.SELECT_RESILIENT = exports.SELECT_PRIORITY = exports.SELECT_JIRA = exports.SELECT_ISSUE_TYPE = exports.SELECT_INCIDENT_TYPE = exports.SELECT_IMPACT = exports.CONNECTOR_SELECTOR = exports.CONNECTOR_RESILIENT = void 0;

var _case = require("../objects/case");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CONNECTOR_RESILIENT = `[data-test-subj="connector-fields-resilient"]`;
exports.CONNECTOR_RESILIENT = CONNECTOR_RESILIENT;
const CONNECTOR_SELECTOR = '[data-test-subj="dropdown-connectors"]';
exports.CONNECTOR_SELECTOR = CONNECTOR_SELECTOR;
const SELECT_IMPACT = `[data-test-subj="impactSelect"]`;
exports.SELECT_IMPACT = SELECT_IMPACT;
const SELECT_INCIDENT_TYPE = `[data-test-subj="incidentTypeComboBox"] input[data-test-subj="comboBoxSearchInput"]`;
exports.SELECT_INCIDENT_TYPE = SELECT_INCIDENT_TYPE;
const SELECT_ISSUE_TYPE = `[data-test-subj="issueTypeSelect"]`;
exports.SELECT_ISSUE_TYPE = SELECT_ISSUE_TYPE;
const SELECT_JIRA = `[data-test-subj="dropdown-connector-${_case.connectorIds.jira}"]`;
exports.SELECT_JIRA = SELECT_JIRA;
const SELECT_PRIORITY = `[data-test-subj="prioritySelect"]`;
exports.SELECT_PRIORITY = SELECT_PRIORITY;
const SELECT_RESILIENT = `[data-test-subj="dropdown-connector-${_case.connectorIds.resilient}"]`;
exports.SELECT_RESILIENT = SELECT_RESILIENT;
const SELECT_SEVERITY = `[data-test-subj="severitySelect"]`;
exports.SELECT_SEVERITY = SELECT_SEVERITY;
const SELECT_SN = `[data-test-subj="dropdown-connector-${_case.connectorIds.sn}"]`;
exports.SELECT_SN = SELECT_SN;
const SELECT_URGENCY = `[data-test-subj="urgencySelect"]`;
exports.SELECT_URGENCY = SELECT_URGENCY;