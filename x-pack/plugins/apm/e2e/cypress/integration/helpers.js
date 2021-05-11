"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginAndWaitForPage = loginAndWaitForPage;
exports.DEFAULT_TIMEOUT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BASE_URL = Cypress.config().baseUrl;
/** The default time in ms to wait for a Cypress command to complete */

const DEFAULT_TIMEOUT = 60 * 1000;
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;

function loginAndWaitForPage(url, dateRange, selectedService) {
  const username = Cypress.env('elasticsearch_username');
  const password = Cypress.env('elasticsearch_password');
  cy.log(`Authenticating via ${username} / ${password}`);
  let fullUrl = `${BASE_URL}${url}?rangeFrom=${dateRange.from}&rangeTo=${dateRange.to}`;

  if (selectedService) {
    fullUrl += `&serviceName=${selectedService}`;
  }

  cy.visit(fullUrl, {
    auth: {
      username,
      password
    }
  });
  cy.viewport('macbook-15'); // wait for loading spinner to disappear

  cy.get('#kbn_loading_message', {
    timeout: DEFAULT_TIMEOUT
  }).should('not.exist');
}