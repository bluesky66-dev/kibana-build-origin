"use strict";

var _test = require("../../../common/test");

var _navigation = require("../../urls/navigation");

var _rule = require("../../objects/rule");

var _page = require("../../screens/common/page");

var _login = require("../../tasks/login");

var _alerts = require("../../tasks/alerts");

var _alerts_detection_rules = require("../../tasks/alerts_detection_rules");

var _rules = require("../../tasks/api_calls/rules");

var _callouts = require("../../tasks/common/callouts");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const loadPageAsPlatformEngineerUser = url => {
  (0, _login.waitForPageWithoutDateRange)(url, _test.ROLES.soc_manager);
  waitForPageTitleToBeShown();
};

const waitForPageTitleToBeShown = () => {
  cy.get(_page.PAGE_TITLE).should('be.visible');
};

describe('Detections > Need Admin Callouts indicating an admin is needed to migrate the alert data set', () => {
  const NEED_ADMIN_FOR_UPDATE_CALLOUT = 'need-admin-for-update-rules';
  before(() => {
    // First, we have to open the app on behalf of a privileged user in order to initialize it.
    // Otherwise the app will be disabled and show a "welcome"-like page.
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL, _test.ROLES.platform_engineer);
    (0, _alerts.waitForAlertsIndexToBeCreated)(); // After that we can login as a soc manager.

    (0, _login.login)(_test.ROLES.soc_manager);
  });
  context('The users index_mapping_outdated is "true" and their admin callouts should show up', () => {
    beforeEach(() => {
      // Index mapping outdated is forced to return true as being outdated so that we get the
      // need admin callouts being shown.
      cy.intercept('GET', '/api/detection_engine/index', {
        index_mapping_outdated: true,
        name: '.siem-signals-default'
      });
    });
    context('On Detections home page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_URL);
      });
      it('We show the need admin primary callout', () => {
        (0, _callouts.waitForCallOutToBeShown)(NEED_ADMIN_FOR_UPDATE_CALLOUT, 'primary');
      });
    });
    context('On Rules Management page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
      });
      it('We show 1 primary callout of need admin', () => {
        (0, _callouts.waitForCallOutToBeShown)(NEED_ADMIN_FOR_UPDATE_CALLOUT, 'primary');
      });
    });
    context('On Rule Details page', () => {
      beforeEach(() => {
        (0, _rules.createCustomRule)(_rule.newRule);
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
        waitForPageTitleToBeShown();
        (0, _alerts_detection_rules.goToRuleDetails)();
      });
      afterEach(() => {
        (0, _rules.deleteCustomRule)();
      });
      it('We show 1 primary callout', () => {
        (0, _callouts.waitForCallOutToBeShown)(NEED_ADMIN_FOR_UPDATE_CALLOUT, 'primary');
      });
    });
  });
  context('The users index_mapping_outdated is "false" and their admin callouts should not show up ', () => {
    beforeEach(() => {
      // Index mapping outdated is forced to return true as being outdated so that we get the
      // need admin callouts being shown.
      cy.intercept('GET', '/api/detection_engine/index', {
        index_mapping_outdated: false,
        name: '.siem-signals-default'
      });
    });
    context('On Detections home page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_URL);
      });
      it('We show the need admin primary callout', () => {
        (0, _callouts.getCallOut)(NEED_ADMIN_FOR_UPDATE_CALLOUT).should('not.exist');
      });
    });
    context('On Rules Management page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
      });
      it('We show 1 primary callout of need admin', () => {
        (0, _callouts.getCallOut)(NEED_ADMIN_FOR_UPDATE_CALLOUT).should('not.exist');
      });
    });
    context('On Rule Details page', () => {
      beforeEach(() => {
        (0, _rules.createCustomRule)(_rule.newRule);
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
        waitForPageTitleToBeShown();
        (0, _alerts_detection_rules.goToRuleDetails)();
      });
      afterEach(() => {
        (0, _rules.deleteCustomRule)();
      });
      it('We show 1 primary callout', () => {
        (0, _callouts.getCallOut)(NEED_ADMIN_FOR_UPDATE_CALLOUT).should('not.exist');
      });
    });
  });
  context('The users index_mapping_outdated is "null" and their admin callouts should not show up ', () => {
    beforeEach(() => {
      // Index mapping outdated is forced to return true as being outdated so that we get the
      // need admin callouts being shown.
      cy.intercept('GET', '/api/detection_engine/index', {
        index_mapping_outdated: null,
        name: '.siem-signals-default'
      });
    });
    context('On Detections home page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_URL);
      });
      it('We show the need admin primary callout', () => {
        (0, _callouts.getCallOut)(NEED_ADMIN_FOR_UPDATE_CALLOUT).should('not.exist');
      });
    });
    context('On Rules Management page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
      });
      it('We show 1 primary callout of need admin', () => {
        (0, _callouts.getCallOut)(NEED_ADMIN_FOR_UPDATE_CALLOUT).should('not.exist');
      });
    });
    context('On Rule Details page', () => {
      beforeEach(() => {
        (0, _rules.createCustomRule)(_rule.newRule);
        loadPageAsPlatformEngineerUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
        waitForPageTitleToBeShown();
        (0, _alerts_detection_rules.goToRuleDetails)();
      });
      afterEach(() => {
        (0, _rules.deleteCustomRule)();
      });
      it('We show 1 primary callout', () => {
        (0, _callouts.getCallOut)(NEED_ADMIN_FOR_UPDATE_CALLOUT).should('not.exist');
      });
    });
  });
});