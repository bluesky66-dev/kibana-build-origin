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


describe('Closing alerts', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.DETECTIONS_URL);
    (0, _alerts2.waitForAlertsPanelToBeLoaded)();
    (0, _alerts2.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRuleActivated)(_rule.newRule);
    (0, _security_header.refreshPage)();
    (0, _create_new_rule.waitForAlertsToPopulate)();
  });
  it('Closes and opens alerts', () => {
    const numberOfAlertsToBeClosed = 3;
    cy.get(_alerts.ALERTS_COUNT).invoke('text').then(numberOfAlerts => {
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${numberOfAlerts} alerts`);
      (0, _alerts2.selectNumberOfAlerts)(numberOfAlertsToBeClosed);
      cy.get(_alerts.SELECTED_ALERTS).should('have.text', `Selected ${numberOfAlertsToBeClosed} alerts`);
      (0, _alerts2.closeAlerts)();
      (0, _alerts2.waitForAlerts)();
      const expectedNumberOfAlertsAfterClosing = +numberOfAlerts - numberOfAlertsToBeClosed;
      cy.get(_alerts.ALERTS_COUNT).should('have.text', expectedNumberOfAlertsAfterClosing.toString());
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${expectedNumberOfAlertsAfterClosing.toString()} alerts`);
      (0, _alerts2.goToClosedAlerts)();
      (0, _alerts2.waitForAlerts)();
      cy.get(_alerts.ALERTS_COUNT).should('have.text', numberOfAlertsToBeClosed.toString());
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${numberOfAlertsToBeClosed.toString()} alerts`);
      cy.get(_alerts.ALERTS).should('have.length', numberOfAlertsToBeClosed);
      const numberOfAlertsToBeOpened = 1;
      (0, _alerts2.selectNumberOfAlerts)(numberOfAlertsToBeOpened);
      cy.get(_alerts.SELECTED_ALERTS).should('have.text', `Selected ${numberOfAlertsToBeOpened} alert`);
      (0, _alerts2.openAlerts)();
      (0, _alerts2.waitForAlerts)();
      const expectedNumberOfClosedAlertsAfterOpened = 2;
      cy.get(_alerts.ALERTS_COUNT).should('have.text', expectedNumberOfClosedAlertsAfterOpened.toString());
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${expectedNumberOfClosedAlertsAfterOpened.toString()} alerts`);
      cy.get(_alerts.ALERTS).should('have.length', expectedNumberOfClosedAlertsAfterOpened);
      (0, _alerts2.goToOpenedAlerts)();
      (0, _alerts2.waitForAlerts)();
      const expectedNumberOfOpenedAlerts = +numberOfAlerts - expectedNumberOfClosedAlertsAfterOpened;
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${expectedNumberOfOpenedAlerts.toString()} alerts`);
      cy.get(_alerts.ALERTS_COUNT).should('have.text', expectedNumberOfOpenedAlerts.toString());
    });
  });
  it('Closes one alert when more than one opened alerts are selected', () => {
    cy.get(_alerts.ALERTS_COUNT).invoke('text').then(numberOfAlerts => {
      const numberOfAlertsToBeClosed = 1;
      const numberOfAlertsToBeSelected = 3;
      cy.get(_alerts.TAKE_ACTION_POPOVER_BTN).should('have.attr', 'disabled');
      (0, _alerts2.selectNumberOfAlerts)(numberOfAlertsToBeSelected);
      cy.get(_alerts.TAKE_ACTION_POPOVER_BTN).should('not.have.attr', 'disabled');
      (0, _alerts2.closeFirstAlert)();
      (0, _alerts2.waitForAlerts)();
      const expectedNumberOfAlerts = +numberOfAlerts - numberOfAlertsToBeClosed;
      cy.get(_alerts.ALERTS_COUNT).should('have.text', expectedNumberOfAlerts.toString());
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${expectedNumberOfAlerts.toString()} alerts`);
      (0, _alerts2.goToClosedAlerts)();
      (0, _alerts2.waitForAlerts)();
      cy.get(_alerts.ALERTS_COUNT).should('have.text', numberOfAlertsToBeClosed.toString());
      cy.get(_alerts.SHOWING_ALERTS).should('have.text', `Showing ${numberOfAlertsToBeClosed.toString()} alert`);
      cy.get(_alerts.ALERTS).should('have.length', numberOfAlertsToBeClosed);
    });
  });
});