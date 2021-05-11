"use strict";

var _rule = require("../../objects/rule");

var _alerts = require("../../tasks/alerts");

var _alerts_detection_rules = require("../../tasks/alerts_detection_rules");

var _rules = require("../../tasks/api_calls/rules");

var _common = require("../../tasks/common");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Export rules', () => {
  beforeEach(() => {
    (0, _common.cleanKibana)();
    cy.intercept('POST', '/api/detection_engine/rules/_export?exclude_export_details=false&file_name=rules_export.ndjson').as('export');
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL);
    (0, _alerts.waitForAlertsPanelToBeLoaded)();
    (0, _alerts.waitForAlertsIndexToBeCreated)();
    (0, _rules.createCustomRule)(_rule.newRule).as('ruleResponse');
  });
  it('Exports a custom rule', function () {
    (0, _alerts.goToManageAlertsDetectionRules)();
    (0, _alerts_detection_rules.exportFirstRule)();
    cy.wait('@export').then(({
      response
    }) => {
      cy.wrap(response.body).should('eql', (0, _rule.expectedExportedRule)(this.ruleResponse));
    });
  });
});