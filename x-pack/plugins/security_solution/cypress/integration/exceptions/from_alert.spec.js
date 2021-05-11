"use strict";

var _exception = require("../../objects/exception");

var _rule = require("../../objects/rule");

var _alerts = require("../../screens/alerts");

var _create_new_rule = require("../../screens/create_new_rule");

var _alerts2 = require("../../tasks/alerts");

var _rules = require("../../tasks/api_calls/rules");

var _alerts_detection_rules = require("../../tasks/alerts_detection_rules");

var _create_new_rule2 = require("../../tasks/create_new_rule");

var _es_archiver = require("../../tasks/es_archiver");

var _login = require("../../tasks/login");

var _rule_details = require("../../tasks/rule_details");

var _security_header = require("../../tasks/security_header");

var _navigation = require("../../urls/navigation");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('From alert', () => {
  const NUMBER_OF_AUDITBEAT_EXCEPTIONS_ALERTS = '1';
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts2.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRule)(_rule.newRule);
    (0, _alerts2.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules.goToRuleDetails)();
    cy.get(_create_new_rule.RULE_STATUS).should('have.text', '—');
    (0, _es_archiver.esArchiverLoad)('auditbeat_for_exceptions');
    (0, _rule_details.activatesRule)();
    (0, _rule_details.waitForTheRuleToBeExecuted)();
    (0, _create_new_rule2.waitForAlertsToPopulate)();
    (0, _security_header.refreshPage)();
    cy.get(_alerts.ALERTS_COUNT).should('exist');
    cy.get(_alerts.NUMBER_OF_ALERTS).should('have.text', NUMBER_OF_AUDITBEAT_EXCEPTIONS_ALERTS);
  });
  afterEach(() => {
    (0, _es_archiver.esArchiverUnload)('auditbeat_for_exceptions');
    (0, _es_archiver.esArchiverUnload)('auditbeat_for_exceptions2');
  });
  it('Creates an exception and deletes it', () => {
    (0, _alerts2.addExceptionFromFirstAlert)();
    (0, _rule_details.addsException)(_exception.exception);
    (0, _es_archiver.esArchiverLoad)('auditbeat_for_exceptions2');
    cy.get(_alerts.ALERTS_COUNT).should('exist');
    cy.get(_alerts.NUMBER_OF_ALERTS).should('have.text', '0');
    (0, _alerts2.goToClosedAlerts)();
    (0, _security_header.refreshPage)();
    cy.get(_alerts.ALERTS_COUNT).should('exist');
    cy.get(_alerts.NUMBER_OF_ALERTS).should('have.text', NUMBER_OF_AUDITBEAT_EXCEPTIONS_ALERTS);
    (0, _alerts2.goToOpenedAlerts)();
    (0, _rule_details.waitForTheRuleToBeExecuted)();
    (0, _security_header.refreshPage)();
    cy.get(_alerts.ALERTS_COUNT).should('exist');
    cy.get(_alerts.NUMBER_OF_ALERTS).should('have.text', '0');
    (0, _rule_details.goToExceptionsTab)();
    (0, _rule_details.removeException)();
    (0, _rule_details.goToAlertsTab)();
    (0, _rule_details.waitForTheRuleToBeExecuted)();
    (0, _create_new_rule2.waitForAlertsToPopulate)();
    (0, _security_header.refreshPage)();
    cy.get(_alerts.ALERTS_COUNT).should('exist');
    cy.get(_alerts.NUMBER_OF_ALERTS).should('have.text', NUMBER_OF_AUDITBEAT_EXCEPTIONS_ALERTS);
  });
});