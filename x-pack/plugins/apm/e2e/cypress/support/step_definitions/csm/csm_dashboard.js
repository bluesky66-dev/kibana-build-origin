"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_TIMEOUT = void 0;

var _steps = require("cypress-cucumber-preprocessor/steps");

var _helpers = require("../../../integration/helpers");

var _client_metrics_helper = require("./client_metrics_helper");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** The default time in ms to wait for a Cypress command to complete */


const DEFAULT_TIMEOUT = {
  timeout: 60 * 1000
};
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
(0, _steps.Given)(`a user browses the APM UI application for RUM Data`, () => {
  // Open UX landing page
  const RANGE_FROM = 'now-24h';
  const RANGE_TO = 'now';
  (0, _helpers.loginAndWaitForPage)(`/app/ux`, {
    from: RANGE_FROM,
    to: RANGE_TO
  }, 'client');
});
(0, _steps.Then)(`should have correct client metrics`, () => {
  const metrics = ['80 ms', '4 ms', '76 ms', '55'];
  (0, _client_metrics_helper.verifyClientMetrics)(metrics, true);
});
(0, _steps.Then)(`should display percentile for page load chart`, () => {
  const pMarkers = '[data-cy=percentile-markers] span';
  cy.get('.euiLoadingChart', DEFAULT_TIMEOUT).should('be.visible');
  (0, _utils.waitForLoadingToFinish)();
  cy.get('.euiStat__title-isLoading').should('not.exist');
  cy.get(pMarkers).eq(0).should('have.text', '50th');
  cy.get(pMarkers).eq(1).should('have.text', '75th');
  cy.get(pMarkers).eq(2).should('have.text', '90th');
  cy.get(pMarkers).eq(3).should('have.text', '95th');
});
(0, _steps.Then)(`should display chart legend`, () => {
  const chartLegend = 'button.echLegendItem__label';
  (0, _utils.waitForLoadingToFinish)();
  cy.get('.euiLoadingChart').should('not.exist');
  cy.get('[data-cy=pageLoadDist]').within(() => {
    cy.get(chartLegend, DEFAULT_TIMEOUT).eq(0).should('have.text', 'Overall');
  });
});
(0, _steps.Then)(`should display tooltip on hover`, () => {
  cy.get('.euiLoadingChart').should('not.exist');
  const pMarkers = '[data-cy=percentile-markers] span.euiToolTipAnchor';
  (0, _utils.waitForLoadingToFinish)();
  cy.get('.euiLoadingChart').should('not.exist');
  const marker = cy.get(pMarkers, DEFAULT_TIMEOUT).eq(0);
  marker.invoke('show');
  marker.trigger('mouseover', {
    force: true
  });
  cy.get('span[data-cy=percentileTooltipTitle]').should('be.visible');
});