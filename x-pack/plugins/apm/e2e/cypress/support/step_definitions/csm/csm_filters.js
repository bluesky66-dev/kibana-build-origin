"use strict";

var _steps = require("cypress-cucumber-preprocessor/steps");

var _csm_dashboard = require("./csm_dashboard");

var _client_metrics_helper = require("./client_metrics_helper");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


(0, _steps.When)(/^the user filters by "([^"]*)"$/, filterName => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get('.euiStat__title-isLoading').should('not.exist');
  cy.get(`#local-filter-${filterName}`).click();
  cy.get(`#local-filter-popover-${filterName}`, _csm_dashboard.DEFAULT_TIMEOUT).within(() => {
    if (filterName === 'os') {
      const osItem = cy.get('li.euiSelectableListItem', _csm_dashboard.DEFAULT_TIMEOUT).eq(2);
      osItem.should('have.text', 'Mac OS X8 ');
      osItem.click(); // sometimes click doesn't work as expected so we need to retry here

      osItem.invoke('attr', 'aria-selected').then(val => {
        if (val === 'false') {
          cy.get('li.euiSelectableListItem', _csm_dashboard.DEFAULT_TIMEOUT).eq(2).click();
        }
      });
    } else {
      const deItem = cy.get('li.euiSelectableListItem', _csm_dashboard.DEFAULT_TIMEOUT).eq(0);
      deItem.should('have.text', 'DE28 ');
      deItem.click(); // sometimes click doesn't work as expected so we need to retry here

      deItem.invoke('attr', 'aria-selected').then(val => {
        if (val === 'false') {
          cy.get('li.euiSelectableListItem', _csm_dashboard.DEFAULT_TIMEOUT).eq(0).click();
        }
      });
    }

    cy.get('[data-cy=applyFilter]').click();
  });
  cy.get(`div#local-filter-values-${filterName}`, _csm_dashboard.DEFAULT_TIMEOUT).within(() => {
    cy.get('span.euiBadge__content').eq(0).should('have.text', filterName === 'os' ? 'Mac OS X' : 'DE');
  });
});
(0, _steps.Then)(/^it filters the client metrics "([^"]*)"$/, filterName => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get('.euiStat__title-isLoading').should('not.exist');
  const data = filterName === 'os' ? ['82 ms', '5 ms', '77 ms', '8'] : ['75 ms', '4 ms', '71 ms', '28'];
  (0, _client_metrics_helper.verifyClientMetrics)(data, true);
  cy.get('[data-cy=clearFilters]', _csm_dashboard.DEFAULT_TIMEOUT).click();
});