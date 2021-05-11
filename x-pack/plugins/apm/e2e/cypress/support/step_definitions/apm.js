"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_TIMEOUT = void 0;

var _steps = require("cypress-cucumber-preprocessor/steps");

var _helpers = require("../../integration/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** The default time in ms to wait for a Cypress command to complete */


const DEFAULT_TIMEOUT = 60 * 1000;
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
(0, _steps.Given)(`a user browses the APM UI application`, () => {
  // Open service inventory page
  (0, _helpers.loginAndWaitForPage)(`/app/apm/services`, {
    from: '2020-06-01T14:59:32.686Z',
    to: '2020-06-16T16:59:36.219Z'
  });
});
(0, _steps.When)(`the user inspects the opbeans-node service`, () => {
  // click opbeans-node service
  cy.get(':contains(opbeans-node)', {
    timeout: DEFAULT_TIMEOUT
  }).last().click({
    force: true
  });
});
(0, _steps.Then)(`should redirect to correct path`, () => {
  cy.url().should('contain', `/app/apm/services/opbeans-node/overview`);
});