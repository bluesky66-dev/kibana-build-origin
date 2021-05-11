"use strict";

var _rule = require("../../objects/rule");

var _timeline = require("../../screens/timeline");

var _alerts = require("../../tasks/alerts");

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


describe('Alerts timeline', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsPanelToBeLoaded)();
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRuleActivated)(_rule.newRule);
    (0, _security_header.refreshPage)();
    (0, _create_new_rule.waitForAlertsToPopulate)();
  });
  it('Investigate alert in default timeline', () => {
    (0, _alerts.investigateFirstAlertInTimeline)();
    cy.get(_timeline.PROVIDER_BADGE).first().invoke('text').then(eventId => {
      (0, _alerts.investigateFirstAlertInTimeline)();
      cy.get(_timeline.PROVIDER_BADGE).filter(':visible').should('have.text', eventId);
    });
  });
});