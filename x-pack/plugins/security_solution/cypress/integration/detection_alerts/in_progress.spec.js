"use strict";

var _rule = require("../../objects/rule");

var _alerts = require("../../screens/alerts");

var _alerts2 = require("../../tasks/alerts");

var _rules = require("../../tasks/api_calls/rules");

var _common = require("../../tasks/common");

var _create_new_rule = require("../../tasks/create_new_rule");

var _login = require("../../tasks/login");

var _security_header = require("../../tasks/security_header");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Marking alerts as in-progress', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.DETECTIONS_URL);
    (0, _alerts2.waitForAlertsPanelToBeLoaded)();
    (0, _alerts2.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRuleActivated)(_rule.newRule);
    (0, _security_header.refreshPage)();
    (0, _create_new_rule.waitForAlertsToPopulate)();
  });
  it('Mark one alert in progress when more than one open alerts are selected', () => {
    cy.get(_alerts.ALERTS_COUNT).invoke('text').then(numberOfAlerts => {
      const numberOfAlertsToBeMarkedInProgress = 1;
      const numberOfAlertsToBeSelected = 3;
      cy.get(_alerts.TAKE_ACTION_POPOVER_BTN).should('have.attr', 'disabled');
      (0, _alerts2.selectNumberOfAlerts)(numberOfAlertsToBeSelected);
      cy.get(_alerts.TAKE_ACTION_POPOVER_BTN).should('not.have.attr', 'disabled');
      (0, _alerts2.markInProgressFirstAlert)();
      (0, _alerts2.waitForAlertsToBeLoaded)();
      const expectedNumberOfAlerts = +numberOfAlerts - numberOfAlertsToBeMarkedInProgress;
      cy.get(_alerts.ALERTS_COUNT).should('have.text', expectedNumberOfAlerts.toString());
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${expectedNumberOfAlerts.toString()} alerts`);
      (0, _alerts2.goToInProgressAlerts)();
      (0, _alerts2.waitForAlerts)();
      cy.get(_alerts.ALERTS_COUNT).should('have.text', numberOfAlertsToBeMarkedInProgress.toString());
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${numberOfAlertsToBeMarkedInProgress.toString()} alert`);
      cy.get(_alerts.ALERTS).should('have.length', numberOfAlertsToBeMarkedInProgress);
    });
  });
});