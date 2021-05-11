"use strict";

var _login = require("../../tasks/login");

var _case = require("../../objects/case");

var _create_new_case = require("../../tasks/create_new_case");

var _all_cases = require("../../tasks/all_cases");

var _navigation = require("../../urls/navigation");

var _case_details = require("../../screens/case_details");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Cases connector incident fields', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    cy.intercept('GET', '/api/cases/configure/connectors/_find', _case.mockConnectorsResponse);
    cy.intercept('POST', `/api/actions/action/${_case.connectorIds.sn}/_execute`, req => {
      const response = req.body.params.subAction === 'getChoices' ? _case.executeResponses.servicenow.choices : {
        status: 'ok',
        data: []
      };
      req.reply(response);
    });
    cy.intercept('POST', `/api/actions/action/${_case.connectorIds.jira}/_execute`, req => {
      const response = req.body.params.subAction === 'issueTypes' ? _case.executeResponses.jira.issueTypes : _case.executeResponses.jira.fieldsByIssueType;
      req.reply(response);
    });
    cy.intercept('POST', `/api/actions/action/${_case.connectorIds.resilient}/_execute`, req => {
      const response = req.body.params.subAction === 'incidentTypes' ? _case.executeResponses.resilient.incidentTypes : _case.executeResponses.resilient.severity;
      req.reply(response);
    });
  });
  it('Correct incident fields show when connector is changed', () => {
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.CASES_URL);
    (0, _all_cases.goToCreateNewCase)();
    (0, _create_new_case.fillCasesMandatoryfields)(_case.case1);
    (0, _create_new_case.fillJiraConnectorOptions)(_case.jiraConnectorOptions);
    (0, _create_new_case.fillServiceNowConnectorOptions)(_case.serviceNowConnectorOpions);
    (0, _create_new_case.fillIbmResilientConnectorOptions)(_case.ibmResilientConnectorOptions);
    (0, _create_new_case.createCase)();
    cy.get(_case_details.CONNECTOR_TITLE).should('have.text', _case.ibmResilientConnectorOptions.title);
    cy.get(_case_details.CONNECTOR_CARD_DETAILS).should('have.text', `${_case.ibmResilientConnectorOptions.title}Incident Types: ${_case.ibmResilientConnectorOptions.incidentTypes.join(', ')}Severity: ${_case.ibmResilientConnectorOptions.severity}`);
  });
});