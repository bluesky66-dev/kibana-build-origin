"use strict";

var _inspect = require("../../screens/inspect");

var _common = require("../../tasks/common");

var _inspect2 = require("../../tasks/inspect");

var _login = require("../../tasks/login");

var _navigation = require("../../urls/navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


describe('Inspect', () => {
  context('Hosts stats and tables', () => {
    before(() => {
      (0, _common.cleanKibana)();
      (0, _login.loginAndWaitForPage)(_navigation.HOSTS_URL);
    });
    afterEach(() => {
      (0, _inspect2.closesModal)();
    });

    _inspect.INSPECT_HOSTS_BUTTONS_IN_SECURITY.forEach(table => it(`inspects the ${table.title}`, () => {
      (0, _inspect2.openStatsAndTables)(table);
      cy.get(_inspect.INSPECT_MODAL).should('be.visible');
    }));
  });
});