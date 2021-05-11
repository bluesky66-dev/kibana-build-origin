"use strict";

var _overview = require("../../screens/overview");

var _overview2 = require("../../tasks/overview");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");

var _overview_search_strategy = _interopRequireDefault(require("../../fixtures/overview_search_strategy.json"));

var _empty_instance = _interopRequireDefault(require("../../fixtures/empty_instance.json"));

var _common = require("../../tasks/common");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Overview Page', () => {
  before(() => {
    (0, _common.cleanKibana)();
  });
  it('Host stats render with correct values', () => {
    cy.stubSearchStrategyApi(_overview_search_strategy.default, 'overviewHost');
    (0, _login.loginAndWaitForPage)(_navigation.OVERVIEW_URL);
    (0, _overview2.expandHostStats)();

    _overview.HOST_STATS.forEach(stat => {
      cy.get(stat.domId).should('have.text', stat.value);
    });
  });
  it('Network stats render with correct values', () => {
    cy.stubSearchStrategyApi(_overview_search_strategy.default, 'overviewNetwork');
    (0, _login.loginAndWaitForPage)(_navigation.OVERVIEW_URL);
    (0, _overview2.expandNetworkStats)();

    _overview.NETWORK_STATS.forEach(stat => {
      cy.get(stat.domId).should('have.text', stat.value);
    });
  });
  describe('with no data', () => {
    it('Splash screen should be here', () => {
      cy.stubSearchStrategyApi(_empty_instance.default, undefined, 'securitySolutionIndexFields');
      (0, _login.loginAndWaitForPage)(_navigation.OVERVIEW_URL);
      cy.get(_overview.OVERVIEW_EMPTY_PAGE).should('be.visible');
    });
  });
});