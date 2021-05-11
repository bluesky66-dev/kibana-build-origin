"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForThePageToBeUpdated = exports.refreshPage = exports.navigateFromHeaderTo = exports.kqlSearch = exports.clearSearchBar = void 0;

var _security_header = require("../screens/security_header");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const clearSearchBar = () => {
  cy.get(_security_header.KQL_INPUT).clear().type('{enter}');
};

exports.clearSearchBar = clearSearchBar;

const kqlSearch = search => {
  cy.get(_security_header.KQL_INPUT).type(search);
};

exports.kqlSearch = kqlSearch;

const navigateFromHeaderTo = page => {
  cy.get(page).click({
    force: true
  });
};

exports.navigateFromHeaderTo = navigateFromHeaderTo;

const refreshPage = () => {
  cy.get(_security_header.REFRESH_BUTTON).click({
    force: true
  }).should('not.have.text', 'Updating');
};

exports.refreshPage = refreshPage;

const waitForThePageToBeUpdated = () => {
  cy.get(_security_header.REFRESH_BUTTON).should('not.have.text', 'Updating');
};

exports.waitForThePageToBeUpdated = waitForThePageToBeUpdated;