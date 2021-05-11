"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyClientMetrics = verifyClientMetrics;

var _csm_dashboard = require("./csm_dashboard");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Verifies the behavior of the client metrics component
 * @param metrics array of three elements
 * @param checkTitleStatus if it's needed to check title elements
 */


function verifyClientMetrics(metrics, checkTitleStatus) {
  const clientMetricsSelector = '[data-cy=client-metrics] .euiStat__title';
  (0, _utils.waitForLoadingToFinish)();

  if (checkTitleStatus) {
    cy.get('.euiStat__title', _csm_dashboard.DEFAULT_TIMEOUT).should('be.visible');
    cy.get('.euiSelect-isLoading').should('not.exist');
  }

  cy.get('.euiStat__title-isLoading').should('not.exist');
  cy.get(clientMetricsSelector).eq(0).should('have.text', metrics[0]);
  cy.get(clientMetricsSelector).eq(1).should('have.text', metrics[1]);
  cy.get(clientMetricsSelector).eq(2).should('have.text', metrics[2]);
}