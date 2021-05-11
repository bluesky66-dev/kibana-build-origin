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


(0, _steps.Then)(`it displays list of relevant js errors`, () => {
  cy.get('.euiBasicTable-loading').should('not.exist');
  cy.get('.euiStat__title-isLoading').should('not.exist');
  (0, _utils.getDataTestSubj)('uxJsErrorsTotal').should('have.text', 'Total errors112');
  (0, _utils.getDataTestSubj)('uxJsErrorTable').within(() => {
    cy.get('tr.euiTableRow', _csm_dashboard.DEFAULT_TIMEOUT).eq(0).invoke('text').should('eq', 'Error messageTest CaptureErrorImpacted page loads100.0 %');
  });
});