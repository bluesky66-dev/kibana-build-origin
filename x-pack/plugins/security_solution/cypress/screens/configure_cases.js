"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SERVICE_NOW_MAPPING = exports.USERNAME = exports.URL = exports.TOASTER = exports.SERVICE_NOW_CONNECTOR_CARD = exports.SAVE_CHANGES_BTN = exports.SAVE_BTN = exports.PASSWORD = exports.CONNECTORS_DROPDOWN = exports.CONNECTOR_NAME = exports.CONNECTOR = exports.ADD_NEW_CONNECTOR_DROPDOWN_BUTTON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ADD_NEW_CONNECTOR_DROPDOWN_BUTTON = '[data-test-subj="dropdown-connector-add-connector"]';
exports.ADD_NEW_CONNECTOR_DROPDOWN_BUTTON = ADD_NEW_CONNECTOR_DROPDOWN_BUTTON;

const CONNECTOR = id => {
  return `[data-test-subj='dropdown-connector-${id}']`;
};

exports.CONNECTOR = CONNECTOR;
const CONNECTOR_NAME = '[data-test-subj="nameInput"]';
exports.CONNECTOR_NAME = CONNECTOR_NAME;
const CONNECTORS_DROPDOWN = '[data-test-subj="dropdown-connectors"]';
exports.CONNECTORS_DROPDOWN = CONNECTORS_DROPDOWN;
const PASSWORD = '[data-test-subj="connector-servicenow-password-form-input"]';
exports.PASSWORD = PASSWORD;
const SAVE_BTN = '[data-test-subj="saveNewActionButton"]';
exports.SAVE_BTN = SAVE_BTN;
const SAVE_CHANGES_BTN = '[data-test-subj="case-configure-action-bottom-bar-save-button"]';
exports.SAVE_CHANGES_BTN = SAVE_CHANGES_BTN;
const SERVICE_NOW_CONNECTOR_CARD = '[data-test-subj=".servicenow-card"]';
exports.SERVICE_NOW_CONNECTOR_CARD = SERVICE_NOW_CONNECTOR_CARD;
const TOASTER = '[data-test-subj="euiToastHeader"]';
exports.TOASTER = TOASTER;
const URL = '[data-test-subj="apiUrlFromInput"]';
exports.URL = URL;
const USERNAME = '[data-test-subj="connector-servicenow-username-form-input"]';
exports.USERNAME = USERNAME;
const SERVICE_NOW_MAPPING = 'code[data-test-subj="field-mapping-target"]';
exports.SERVICE_NOW_MAPPING = SERVICE_NOW_MAPPING;