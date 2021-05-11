"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillIbmResilientConnectorOptions = exports.fillServiceNowConnectorOptions = exports.fillJiraConnectorOptions = exports.createCase = exports.attachTimeline = exports.fillCasesMandatoryfields = exports.filterStatusOpen = exports.backToCases = void 0;

var _all_cases = require("../screens/all_cases");

var _create_new_case = require("../screens/create_new_case");

var _edit_connector = require("../screens/edit_connector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const backToCases = () => {
  cy.get(_create_new_case.BACK_TO_CASES_BTN).click({
    force: true
  });
};

exports.backToCases = backToCases;

const filterStatusOpen = () => {
  cy.get(_all_cases.ALL_CASES_OPEN_CASES_COUNT).click();
  cy.get(_all_cases.ALL_CASES_OPEN_FILTER).click();
};

exports.filterStatusOpen = filterStatusOpen;

const fillCasesMandatoryfields = newCase => {
  cy.get(_create_new_case.TITLE_INPUT).type(newCase.name, {
    force: true
  });
  newCase.tags.forEach(tag => {
    cy.get(_create_new_case.TAGS_INPUT).type(`${tag}{enter}`, {
      force: true
    });
  });
  cy.get(_create_new_case.DESCRIPTION_INPUT).type(`${newCase.description} `, {
    force: true
  });
};

exports.fillCasesMandatoryfields = fillCasesMandatoryfields;

const attachTimeline = newCase => {
  cy.get(_create_new_case.INSERT_TIMELINE_BTN).click({
    force: true
  });
  cy.get(_create_new_case.TIMELINE_SEARCHBOX).type(`${newCase.timeline.title}{enter}`);
};

exports.attachTimeline = attachTimeline;

const createCase = () => {
  cy.get(_create_new_case.SUBMIT_BTN).click({
    force: true
  });
  cy.get(_create_new_case.LOADING_SPINNER).should('exist');
  cy.get(_create_new_case.LOADING_SPINNER).should('not.exist');
};

exports.createCase = createCase;

const fillJiraConnectorOptions = jiraConnector => {
  cy.get(_edit_connector.CONNECTOR_SELECTOR).click({
    force: true
  });
  cy.get(_edit_connector.SELECT_JIRA).click({
    force: true
  });
  cy.get(_edit_connector.SELECT_ISSUE_TYPE).should('exist');
  cy.get(_edit_connector.SELECT_PRIORITY).should('exist');
  cy.get(_edit_connector.SELECT_ISSUE_TYPE).select(jiraConnector.issueType);
  cy.get(_edit_connector.SELECT_PRIORITY).select(jiraConnector.priority);
};

exports.fillJiraConnectorOptions = fillJiraConnectorOptions;

const fillServiceNowConnectorOptions = serviceNowConnectorOpions => {
  cy.get(_edit_connector.CONNECTOR_SELECTOR).click({
    force: true
  });
  cy.get(_edit_connector.SELECT_SN).click({
    force: true
  });
  cy.get(_edit_connector.SELECT_SEVERITY).should('exist');
  cy.get(_edit_connector.SELECT_URGENCY).should('exist');
  cy.get(_edit_connector.SELECT_IMPACT).should('exist');
  cy.get(_edit_connector.SELECT_URGENCY).select(serviceNowConnectorOpions.urgency);
  cy.get(_edit_connector.SELECT_SEVERITY).select(serviceNowConnectorOpions.severity);
  cy.get(_edit_connector.SELECT_IMPACT).select(serviceNowConnectorOpions.impact);
};

exports.fillServiceNowConnectorOptions = fillServiceNowConnectorOptions;

const fillIbmResilientConnectorOptions = ibmResilientConnector => {
  cy.get(_edit_connector.CONNECTOR_SELECTOR).click({
    force: true
  });
  cy.get(_edit_connector.SELECT_RESILIENT).click({
    force: true
  });
  cy.get(_edit_connector.SELECT_INCIDENT_TYPE).should('exist');
  cy.get(_edit_connector.SELECT_SEVERITY).should('exist');
  ibmResilientConnector.incidentTypes.forEach(incidentType => {
    cy.get(_edit_connector.SELECT_INCIDENT_TYPE).type(`${incidentType}{enter}`, {
      force: true
    });
  });
  cy.get(_edit_connector.CONNECTOR_RESILIENT).click({
    force: true
  });
  cy.get(_edit_connector.SELECT_SEVERITY).select(ibmResilientConnector.severity);
};

exports.fillIbmResilientConnectorOptions = fillIbmResilientConnectorOptions;