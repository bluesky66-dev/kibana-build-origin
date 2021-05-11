"use strict";

var _steps = require("cypress-cucumber-preprocessor/steps");

var _csm_dashboard = require("./csm_dashboard");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** The default time in ms to wait for a Cypress command to complete */


(0, _steps.Given)(`a user clicks the page load breakdown filter`, () => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get('.euiStat__title-isLoading').should('not.exist');
  const breakDownBtn = cy.get('[data-test-subj=pldBreakdownFilter]', _csm_dashboard.DEFAULT_TIMEOUT);
  breakDownBtn.click();
});
(0, _steps.When)(`the user selected the breakdown`, () => {
  cy.get('[id="user_agent.name"]', _csm_dashboard.DEFAULT_TIMEOUT).click(); // click outside popover to close it

  cy.get('[data-cy=pageLoadDist]').click();
});
(0, _steps.Then)(`breakdown series should appear in chart`, () => {
  cy.get('.euiLoadingChart').should('not.exist');
  cy.get('[data-cy=pageLoadDist]').within(() => {
    cy.get('button.echLegendItem__label[title=Chrome] ', _csm_dashboard.DEFAULT_TIMEOUT).invoke('text').should('eq', 'Chrome');
    cy.get('button.echLegendItem__label', _csm_dashboard.DEFAULT_TIMEOUT).should('have.text', 'ChromeChrome Mobile WebViewSafariFirefoxMobile SafariChrome MobileChrome Mobile iOSOverall');
  });
});