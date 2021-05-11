"use strict";

var _rule = require("../../objects/rule");

var _test = require("../../../common/test");

var _alerts = require("../../tasks/alerts");

var _rules = require("../../tasks/api_calls/rules");

var _common = require("../../tasks/common");

var _create_new_rule = require("../../tasks/create_new_rule");

var _login = require("../../tasks/login");

var _security_header = require("../../tasks/security_header");

var _navigation = require("../../urls/navigation");

var _alerts_detection_rules = require("../../screens/alerts_detection_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const loadDetectionsPage = role => {
  (0, _login.waitForPageWithoutDateRange)(_navigation.DETECTIONS_URL, role);
  (0, _create_new_rule.waitForAlertsToPopulate)();
};

describe('Alerts timeline', () => {
  before(() => {
    // First we login as a privileged user to create alerts.
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPage)(_navigation.DETECTIONS_URL, _test.ROLES.platform_engineer);
    (0, _alerts.waitForAlertsPanelToBeLoaded)();
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRuleActivated)(_rule.newRule);
    (0, _security_header.refreshPage)();
    (0, _create_new_rule.waitForAlertsToPopulate)(); // Then we login as read-only user to test.

    (0, _login.login)(_test.ROLES.reader);
  });
  context('Privileges: read only', () => {
    beforeEach(() => {
      loadDetectionsPage(_test.ROLES.reader);
    });
    it('should not allow user with read only privileges to attach alerts to cases', () => {
      cy.get(_alerts_detection_rules.ATTACH_ALERT_TO_CASE_BUTTON).first().should('be.disabled');
    });
  });
  context('Privileges: can crud', () => {
    beforeEach(() => {
      loadDetectionsPage(_test.ROLES.platform_engineer);
    });
    it('should allow a user with crud privileges to attach alerts to cases', () => {
      cy.get(_alerts_detection_rules.ATTACH_ALERT_TO_CASE_BUTTON).first().should('not.be.disabled');
    });
  });
});