"use strict";

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");

var _alerts = require("../../tasks/alerts");

var _alerts_detection_rules2 = require("../../tasks/alerts_detection_rules");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");

var _rule = require("../../objects/rule");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Alerts rules, prebuilt rules', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
  });
  it('Loads prebuilt rules', () => {
    const expectedNumberOfRules = _rule.totalNumberOfPrebuiltRules;
    const expectedElasticRulesBtnText = `Elastic rules (${expectedNumberOfRules})`;
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsPanelToBeLoaded)();
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
    (0, _alerts_detection_rules2.loadPrebuiltDetectionRules)();
    (0, _alerts_detection_rules2.waitForPrebuiltDetectionRulesToBeLoaded)();
    cy.get(_alerts_detection_rules.ELASTIC_RULES_BTN).should('have.text', expectedElasticRulesBtnText);
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    cy.get(_alerts_detection_rules.SHOWING_RULES_TEXT).should('have.text', `Showing ${expectedNumberOfRules} rules`);
    cy.get(_alerts_detection_rules.RULES_TABLE).then($table1 => {
      const firstScreenRules = $table1.find(_alerts_detection_rules.RULES_ROW).length;
      (0, _alerts_detection_rules2.goToNextPage)();
      cy.get(_alerts_detection_rules.RULES_TABLE).then($table2 => {
        const secondScreenRules = $table2.find(_alerts_detection_rules.RULES_ROW).length;
        const totalNumberOfRules = firstScreenRules + secondScreenRules;
        expect(totalNumberOfRules).to.eql(expectedNumberOfRules);
      });
    });
  });
});
describe('Deleting prebuilt rules', () => {
  beforeEach(() => {
    const expectedNumberOfRules = _rule.totalNumberOfPrebuiltRules;
    const expectedElasticRulesBtnText = `Elastic rules (${expectedNumberOfRules})`;
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsPanelToBeLoaded)();
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
    (0, _alerts_detection_rules2.loadPrebuiltDetectionRules)();
    (0, _alerts_detection_rules2.waitForPrebuiltDetectionRulesToBeLoaded)();
    cy.get(_alerts_detection_rules.ELASTIC_RULES_BTN).should('have.text', expectedElasticRulesBtnText);
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
  });
  it('Does not allow to delete one rule when more than one is selected', () => {
    const numberOfRulesToBeSelected = 2;
    (0, _alerts_detection_rules2.selectNumberOfRules)(numberOfRulesToBeSelected);
    cy.get(_alerts_detection_rules.COLLAPSED_ACTION_BTN).each(collapsedItemActionBtn => {
      cy.wrap(collapsedItemActionBtn).should('have.attr', 'disabled');
    });
  });
  it('Deletes and recovers one rule', () => {
    const expectedNumberOfRulesAfterDeletion = _rule.totalNumberOfPrebuiltRules - 1;
    const expectedNumberOfRulesAfterRecovering = _rule.totalNumberOfPrebuiltRules;
    (0, _alerts_detection_rules2.deleteFirstRule)();
    cy.reload();
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    cy.get(_alerts_detection_rules.ELASTIC_RULES_BTN).should('have.text', `Elastic rules (${expectedNumberOfRulesAfterDeletion})`);
    cy.get(_alerts_detection_rules.RELOAD_PREBUILT_RULES_BTN).should('exist');
    cy.get(_alerts_detection_rules.RELOAD_PREBUILT_RULES_BTN).should('have.text', 'Install 1 Elastic prebuilt rule ');
    (0, _alerts_detection_rules2.reloadDeletedRules)();
    cy.get(_alerts_detection_rules.RELOAD_PREBUILT_RULES_BTN).should('not.exist');
    cy.reload();
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    cy.get(_alerts_detection_rules.ELASTIC_RULES_BTN).should('have.text', `Elastic rules (${expectedNumberOfRulesAfterRecovering})`);
  });
  it('Deletes and recovers more than one rule', () => {
    const numberOfRulesToBeSelected = 2;
    const expectedNumberOfRulesAfterDeletion = _rule.totalNumberOfPrebuiltRules - 2;
    const expectedNumberOfRulesAfterRecovering = _rule.totalNumberOfPrebuiltRules;
    (0, _alerts_detection_rules2.selectNumberOfRules)(numberOfRulesToBeSelected);
    (0, _alerts_detection_rules2.deleteSelectedRules)();
    cy.reload();
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    cy.get(_alerts_detection_rules.RELOAD_PREBUILT_RULES_BTN).should('exist');
    cy.get(_alerts_detection_rules.RELOAD_PREBUILT_RULES_BTN).should('have.text', `Install ${numberOfRulesToBeSelected} Elastic prebuilt rules `);
    cy.get(_alerts_detection_rules.ELASTIC_RULES_BTN).should('have.text', `Elastic rules (${expectedNumberOfRulesAfterDeletion})`);
    (0, _alerts_detection_rules2.reloadDeletedRules)();
    cy.get(_alerts_detection_rules.RELOAD_PREBUILT_RULES_BTN).should('not.exist');
    cy.reload();
    (0, _alerts_detection_rules2.changeRowsPerPageTo300)();
    cy.get(_alerts_detection_rules.ELASTIC_RULES_BTN).should('have.text', `Elastic rules (${expectedNumberOfRulesAfterRecovering})`);
  });
});