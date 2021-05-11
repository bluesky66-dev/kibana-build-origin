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


(0, _steps.When)(`a user clicks inside url search field`, () => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get('.euiStat__title-isLoading').should('not.exist');
  cy.get('span[data-cy=csmUrlFilter]', _csm_dashboard.DEFAULT_TIMEOUT).within(() => {
    cy.get('input.euiFieldSearch').click();
  });
});
(0, _steps.Then)(`it displays top pages in the suggestion popover`, () => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get('div.euiPopover__panel-isOpen', _csm_dashboard.DEFAULT_TIMEOUT).within(() => {
    const listOfUrls = cy.get('li.euiSelectableListItem');
    listOfUrls.should('have.length', 5);
    const actualUrlsText = ['http://opbeans-node:3000/dashboardTotal page views: 17Page load duration: 109 ms (median)', 'http://opbeans-node:3000/ordersTotal page views: 14Page load duration: 72 ms (median)'];
    cy.get('li.euiSelectableListItem').eq(0).should('have.text', actualUrlsText[0]);
    cy.get('li.euiSelectableListItem').eq(1).should('have.text', actualUrlsText[1]);
  });
});
(0, _steps.When)(`a user enters a query in url search field`, () => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get('[data-cy=csmUrlFilter]').within(() => {
    cy.get('input.euiSelectableSearch').type('cus');
  });
  (0, _utils.waitForLoadingToFinish)();
});
(0, _steps.Then)(`it should filter results based on query`, () => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get('div.euiPopover__panel-isOpen', _csm_dashboard.DEFAULT_TIMEOUT).within(() => {
    const listOfUrls = cy.get('li.euiSelectableListItem');
    listOfUrls.should('have.length', 1);
    const actualUrlsText = ['http://opbeans-node:3000/customersTotal page views: 10Page load duration: 76 ms (median)'];
    cy.get('li.euiSelectableListItem').eq(0).should('have.text', actualUrlsText[0]);
  });
});