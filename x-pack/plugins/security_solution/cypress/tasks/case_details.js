"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openCaseTimeline = exports.deleteCase = void 0;

var _timeline = require("../screens/timeline");

var _case_details = require("../screens/case_details");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteCase = () => {
  cy.get(_case_details.CASE_ACTIONS_BTN).first().click();
  cy.get(_case_details.DELETE_CASE_BTN).click();
  cy.get(_case_details.DELETE_CASE_CONFIRMATION_BTN).click();
};

exports.deleteCase = deleteCase;

const openCaseTimeline = () => {
  cy.get(_case_details.CASE_DETAILS_TIMELINE_LINK_MARKDOWN).click();
  cy.get(_timeline.TIMELINE_TITLE).should('exist');
};

exports.openCaseTimeline = openCaseTimeline;