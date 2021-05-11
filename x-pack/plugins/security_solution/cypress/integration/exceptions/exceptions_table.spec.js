"use strict";

var _exception = require("../../objects/exception");

var _rule = require("../../objects/rule");

var _create_new_rule = require("../../screens/create_new_rule");

var _alerts = require("../../tasks/alerts");

var _rules = require("../../tasks/api_calls/rules");

var _alerts_detection_rules = require("../../tasks/alerts_detection_rules");

var _es_archiver = require("../../tasks/es_archiver");

var _login = require("../../tasks/login");

var _rule_details = require("../../tasks/rule_details");

var _navigation = require("../../urls/navigation");

var _common = require("../../tasks/common");

var _exceptions_table = require("../../tasks/exceptions_table");

var _exceptions = require("../../screens/exceptions");

var _exceptions2 = require("../../tasks/api_calls/exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Exceptions Table', () => {
  before(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRule)(_rule.newRule);
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules.goToRuleDetails)();
    cy.get(_create_new_rule.RULE_STATUS).should('have.text', '—');
    (0, _es_archiver.esArchiverLoad)('auditbeat_for_exceptions'); // Add a detections exception list

    (0, _rule_details.goToExceptionsTab)();
    (0, _rule_details.addsExceptionFromRuleSettings)(_exception.exception);
    (0, _rule_details.waitForTheRuleToBeExecuted)(); // Create exception list not used by any rules

    (0, _exceptions2.createExceptionList)(_exception.exceptionList).as('exceptionListResponse');
    (0, _rule_details.goBackToAllRulesTable)();
    (0, _alerts_detection_rules.waitForRulesTableToBeLoaded)();
  });
  after(() => {
    (0, _es_archiver.esArchiverUnload)('auditbeat_for_exceptions');
  });
  it('Filters exception lists on search', () => {
    (0, _exceptions_table.goToExceptionsTable)();
    (0, _exceptions_table.waitForExceptionsTableToBeLoaded)();
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 3 lists`); // Single word search

    (0, _exceptions_table.searchForExceptionList)('Endpoint');
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 1 list`);
    cy.get(_exceptions.EXCEPTIONS_TABLE_LIST_NAME).should('have.text', 'Endpoint Security Exception List'); // Multi word search

    (0, _exceptions_table.clearSearchSelection)();
    (0, _exceptions_table.searchForExceptionList)('New Rule Test');
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 2 lists`);
    cy.get(_exceptions.EXCEPTIONS_TABLE_LIST_NAME).eq(0).should('have.text', 'Test exception list');
    cy.get(_exceptions.EXCEPTIONS_TABLE_LIST_NAME).eq(1).should('have.text', 'New Rule Test'); // Exact phrase search

    (0, _exceptions_table.clearSearchSelection)();
    (0, _exceptions_table.searchForExceptionList)('"New Rule Test"');
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 1 list`);
    cy.get(_exceptions.EXCEPTIONS_TABLE_LIST_NAME).should('have.text', 'New Rule Test'); // Field search

    (0, _exceptions_table.clearSearchSelection)();
    (0, _exceptions_table.searchForExceptionList)('list_id:endpoint_list');
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 1 list`);
    cy.get(_exceptions.EXCEPTIONS_TABLE_LIST_NAME).should('have.text', 'Endpoint Security Exception List');
    (0, _exceptions_table.clearSearchSelection)();
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 3 lists`);
  });
  it('Exports exception list', async function () {
    cy.intercept(/(\/api\/exception_lists\/_export)/).as('export');
    (0, _exceptions_table.goToExceptionsTable)();
    (0, _exceptions_table.waitForExceptionsTableToBeLoaded)();
    (0, _exceptions_table.exportExceptionList)();
    cy.wait('@export').then(({
      response
    }) => {
      cy.wrap(response.body).should('eql', (0, _exception.expectedExportedExceptionList)(this.exceptionListResponse));
    });
  });
  it('Deletes exception list without rule reference', () => {
    (0, _exceptions_table.goToExceptionsTable)();
    (0, _exceptions_table.waitForExceptionsTableToBeLoaded)();
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 3 lists`);
    (0, _exceptions_table.deleteExceptionListWithoutRuleReference)();
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 2 lists`);
  });
  it('Deletes exception list with rule reference', () => {
    (0, _exceptions_table.goToExceptionsTable)();
    (0, _exceptions_table.waitForExceptionsTableToBeLoaded)();
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 2 lists`);
    (0, _exceptions_table.deleteExceptionListWithRuleReference)();
    cy.get(_exceptions.EXCEPTIONS_TABLE_SHOWING_LISTS).should('have.text', `Showing 1 list`);
  });
});