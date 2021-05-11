"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goToEditExternalConnection = exports.goToCaseDetails = exports.goToCreateNewCase = void 0;

var _all_cases = require("../screens/all_cases");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const goToCreateNewCase = () => {
  cy.get(_all_cases.ALL_CASES_CREATE_NEW_CASE_BTN).click({
    force: true
  });
};

exports.goToCreateNewCase = goToCreateNewCase;

const goToCaseDetails = () => {
  cy.get(_all_cases.ALL_CASES_NAME).click({
    force: true
  });
};

exports.goToCaseDetails = goToCaseDetails;

const goToEditExternalConnection = () => {
  cy.get(_all_cases.EDIT_EXTERNAL_CONNECTION).click({
    force: true
  });
};

exports.goToEditExternalConnection = goToEditExternalConnection;