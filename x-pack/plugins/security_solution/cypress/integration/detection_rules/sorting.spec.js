"use strict";

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");

var _alerts = require("../../tasks/alerts");

var _alerts_detection_rules2 = require("../../tasks/alerts_detection_rules");

var _login = require("../../tasks/login");

var _constants = require("../../../common/constants");

var _navigation = require("../../urls/navigation");

var _rules = require("../../tasks/api_calls/rules");

var _common = require("../../tasks/common");

var _rule = require("../../objects/rule");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Alerts detection rules', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsPanelToBeLoaded)();
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRule)(_rule.newRule, '1');
    (0, _rules.createCustomRule)(_rule.existingRule, '2');
    (0, _rules.createCustomRule)(_rule.newOverrideRule, '3');
    (0, _rules.createCustomRule)(_rule.newThresholdRule, '4');
  });
  it('Sorts by activated rules', () => {
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
    cy.get(_alerts_detection_rules.RULE_NAME).eq(_alerts_detection_rules.SECOND_RULE).invoke('text').then(secondInitialRuleName => {
      (0, _alerts_detection_rules2.activateRule)(_alerts_detection_rules.SECOND_RULE);
      (0, _alerts_detection_rules2.waitForRuleToBeActivated)();
      cy.get(_alerts_detection_rules.RULE_NAME).eq(_alerts_detection_rules.FOURTH_RULE).invoke('text').then(fourthInitialRuleName => {
        (0, _alerts_detection_rules2.activateRule)(_alerts_detection_rules.FOURTH_RULE);
        (0, _alerts_detection_rules2.waitForRuleToBeActivated)();
        (0, _alerts_detection_rules2.sortByActivatedRules)();
        cy.get(_alerts_detection_rules.RULE_NAME).eq(_alerts_detection_rules.FIRST_RULE).invoke('text').then(firstRuleName => {
          cy.get(_alerts_detection_rules.RULE_NAME).eq(_alerts_detection_rules.SECOND_RULE).invoke('text').then(secondRuleName => {
            const expectedRulesNames = `${firstRuleName} ${secondRuleName}`;
            cy.wrap(expectedRulesNames).should('include', secondInitialRuleName);
            cy.wrap(expectedRulesNames).should('include', fourthInitialRuleName);
          });
        });
        cy.get(_alerts_detection_rules.RULE_SWITCH).eq(_alerts_detection_rules.FIRST_RULE).should('have.attr', 'role', 'switch');
        cy.get(_alerts_detection_rules.RULE_SWITCH).eq(_alerts_detection_rules.SECOND_RULE).should('have.attr', 'role', 'switch');
      });
    });
  });
  it('Pagination updates page number and results', () => {
    (0, _rules.createCustomRule)({ ..._rule.newRule,
      name: 'Test a rule'
    }, '5');
    (0, _rules.createCustomRule)({ ..._rule.newRule,
      name: 'Not same as first rule'
    }, '6');
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)();
    (0, _alerts_detection_rules2.changeRowsPerPageTo)(5);
    const FIRST_PAGE_SELECTOR = (0, _alerts_detection_rules.pageSelector)(1);
    const SECOND_PAGE_SELECTOR = (0, _alerts_detection_rules.pageSelector)(2);
    cy.get(_alerts_detection_rules.RULES_TABLE).find(FIRST_PAGE_SELECTOR).should('have.class', 'euiPaginationButton-isActive');
    cy.get(_alerts_detection_rules.RULES_TABLE).find(_alerts_detection_rules.RULE_NAME).first().invoke('text').then(ruleNameFirstPage => {
      (0, _alerts_detection_rules2.goToPage)(2);
      cy.get(_alerts_detection_rules.RULES_TABLE).find(_alerts_detection_rules.RULE_NAME).first().invoke('text').should(ruleNameSecondPage => {
        expect(ruleNameFirstPage).not.to.eq(ruleNameSecondPage);
      });
    });
    cy.get(_alerts_detection_rules.RULES_TABLE).find(FIRST_PAGE_SELECTOR).should('not.have.class', 'euiPaginationButton-isActive');
    cy.get(_alerts_detection_rules.RULES_TABLE).find(SECOND_PAGE_SELECTOR).should('have.class', 'euiPaginationButton-isActive');
  });
  it('Auto refreshes rules', () => {
    cy.clock(Date.now());
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules2.waitForRulesTableToBeLoaded)(); // mock 1 minute passing to make sure refresh
    // is conducted

    (0, _alerts_detection_rules2.checkAutoRefresh)(_constants.DEFAULT_RULE_REFRESH_INTERVAL_VALUE, 'be.visible'); // mock 45 minutes passing to check that idle modal shows
    // and refreshing is paused

    (0, _alerts_detection_rules2.checkAllRulesIdleModal)('be.visible');
    (0, _alerts_detection_rules2.checkAutoRefresh)(_constants.DEFAULT_RULE_REFRESH_INTERVAL_VALUE, 'not.exist'); // clicking on modal to continue, should resume refreshing

    (0, _alerts_detection_rules2.dismissAllRulesIdleModal)();
    (0, _alerts_detection_rules2.checkAutoRefresh)(_constants.DEFAULT_RULE_REFRESH_INTERVAL_VALUE, 'be.visible'); // if mouse movement detected, idle modal should not
    // show after 45 min

    (0, _alerts_detection_rules2.resetAllRulesIdleModalTimeout)();
    cy.get(_alerts_detection_rules.RULE_AUTO_REFRESH_IDLE_MODAL).should('not.exist');
  });
});