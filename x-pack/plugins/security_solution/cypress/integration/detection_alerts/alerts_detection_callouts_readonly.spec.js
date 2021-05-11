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


const loadPageAsReadOnlyUser = url => {
  (0, _login.waitForPageWithoutDateRange)(url, _test.ROLES.reader);
  waitForPageTitleToBeShown();
};

const loadPageAsPlatformEngineer = url => {
  (0, _login.waitForPageWithoutDateRange)(url, _test.ROLES.platform_engineer);
  waitForPageTitleToBeShown();
};

const reloadPage = () => {
  cy.reload();
  waitForPageTitleToBeShown();
};

const waitForPageTitleToBeShown = () => {
  cy.get(_page.PAGE_TITLE).should('be.visible');
};

describe('Detections > Callouts', () => {
  const ALERTS_CALLOUT = 'read-only-access-to-alerts';
  const RULES_CALLOUT = 'read-only-access-to-rules';
  before(() => {
    // First, we have to open the app on behalf of a privileged user in order to initialize it.
    // Otherwise the app will be disabled and show a "welcome"-like page.
    (0, _common.cleanKibana)();
    (0, _login.loginAndWaitForPageWithoutDateRange)(_navigation.DETECTIONS_URL, _test.ROLES.platform_engineer);
    (0, _alerts.waitForAlertsIndexToBeCreated)(); // After that we can login as a read-only user.

    (0, _login.login)(_test.ROLES.reader);
  });
  context('indicating read-only access to resources', () => {
    context('On Detections home page', () => {
      beforeEach(() => {
        loadPageAsReadOnlyUser(_navigation.DETECTIONS_URL);
      });
      it('We show one primary callout', () => {
        (0, _callouts.waitForCallOutToBeShown)(ALERTS_CALLOUT, 'primary');
      });
      context('When a user clicks Dismiss on the callout', () => {
        it('We hide it and persist the dismissal', () => {
          (0, _callouts.waitForCallOutToBeShown)(ALERTS_CALLOUT, 'primary');
          (0, _callouts.dismissCallOut)(ALERTS_CALLOUT);
          reloadPage();
          (0, _callouts.getCallOut)(ALERTS_CALLOUT).should('not.exist');
        });
      });
    });
    context('On Rules Management page', () => {
      beforeEach(() => {
        loadPageAsReadOnlyUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
      });
      it('We show one primary callout', () => {
        (0, _callouts.waitForCallOutToBeShown)(RULES_CALLOUT, 'primary');
      });
      context('When a user clicks Dismiss on the callout', () => {
        it('We hide it and persist the dismissal', () => {
          (0, _callouts.waitForCallOutToBeShown)(RULES_CALLOUT, 'primary');
          (0, _callouts.dismissCallOut)(RULES_CALLOUT);
          reloadPage();
          (0, _callouts.getCallOut)(RULES_CALLOUT).should('not.exist');
        });
      });
    });
    context('On Rule Details page', () => {
      beforeEach(() => {
        (0, _rules.createCustomRule)(_rule.newRule);
        loadPageAsReadOnlyUser(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
        waitForPageTitleToBeShown();
        (0, _alerts_detection_rules.goToRuleDetails)();
      });
      afterEach(() => {
        (0, _rules.deleteCustomRule)();
      });
      it('We show two primary callouts', () => {
        (0, _callouts.waitForCallOutToBeShown)(ALERTS_CALLOUT, 'primary');
        (0, _callouts.waitForCallOutToBeShown)(RULES_CALLOUT, 'primary');
      });
      context('When a user clicks Dismiss on the callouts', () => {
        it('We hide them and persist the dismissal', () => {
          (0, _callouts.waitForCallOutToBeShown)(ALERTS_CALLOUT, 'primary');
          (0, _callouts.waitForCallOutToBeShown)(RULES_CALLOUT, 'primary');
          (0, _callouts.dismissCallOut)(ALERTS_CALLOUT);
          reloadPage();
          (0, _callouts.getCallOut)(ALERTS_CALLOUT).should('not.exist');
          (0, _callouts.getCallOut)(RULES_CALLOUT).should('be.visible');
          (0, _callouts.dismissCallOut)(RULES_CALLOUT);
          reloadPage();
          (0, _callouts.getCallOut)(ALERTS_CALLOUT).should('not.exist');
          (0, _callouts.getCallOut)(RULES_CALLOUT).should('not.exist');
        });
      });
    });
  });
  context('indicating read-write access to resources', () => {
    context('On Detections home page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineer(_navigation.DETECTIONS_URL);
      });
      it('We show no callout', () => {
        (0, _callouts.getCallOut)(ALERTS_CALLOUT).should('not.exist');
        (0, _callouts.getCallOut)(RULES_CALLOUT).should('not.exist');
      });
    });
    context('On Rules Management page', () => {
      beforeEach(() => {
        loadPageAsPlatformEngineer(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
      });
      it('We show no callout', () => {
        (0, _callouts.getCallOut)(ALERTS_CALLOUT).should('not.exist');
        (0, _callouts.getCallOut)(RULES_CALLOUT).should('not.exist');
      });
    });
    context('On Rule Details page', () => {
      beforeEach(() => {
        (0, _rules.createCustomRule)(_rule.newRule);
        loadPageAsPlatformEngineer(_navigation.DETECTIONS_RULE_MANAGEMENT_URL);
        waitForPageTitleToBeShown();
        (0, _alerts_detection_rules.goToRuleDetails)();
      });
      afterEach(() => {
        (0, _rules.deleteCustomRule)();
      });
      it('We show no callouts', () => {
        (0, _callouts.getCallOut)(ALERTS_CALLOUT).should('not.exist');
        (0, _callouts.getCallOut)(RULES_CALLOUT).should('not.exist');
      });
    });
  });
});