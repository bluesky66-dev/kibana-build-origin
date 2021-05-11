"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearSearchSelection = exports.exportExceptionList = exports.deleteExceptionListWithRuleReference = exports.deleteExceptionListWithoutRuleReference = exports.searchForExceptionList = exports.waitForExceptionsTableToBeLoaded = exports.goToExceptionsTable = void 0;

var _exceptions = require("../screens/exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const goToExceptionsTable = () => {
  cy.get(_exceptions.EXCEPTIONS_TABLE_TAB).should('exist').click({
    force: true
  });
};

exports.goToExceptionsTable = goToExceptionsTable;

const waitForExceptionsTableToBeLoaded = () => {
  cy.get(_exceptions.EXCEPTIONS_TABLE).should('exist');
  cy.get(_exceptions.EXCEPTIONS_TABLE_SEARCH).should('exist');
};

exports.waitForExceptionsTableToBeLoaded = waitForExceptionsTableToBeLoaded;

const searchForExceptionList = searchText => {
  cy.get(_exceptions.EXCEPTIONS_TABLE_SEARCH).type(searchText, {
    force: true
  }).trigger('search');
};

exports.searchForExceptionList = searchForExceptionList;

const deleteExceptionListWithoutRuleReference = () => {
  cy.get(_exceptions.EXCEPTIONS_TABLE_DELETE_BTN).first().click();
  cy.get(_exceptions.EXCEPTIONS_TABLE_MODAL).should('not.exist');
};

exports.deleteExceptionListWithoutRuleReference = deleteExceptionListWithoutRuleReference;

const deleteExceptionListWithRuleReference = () => {
  cy.get(_exceptions.EXCEPTIONS_TABLE_DELETE_BTN).first().click();
  cy.get(_exceptions.EXCEPTIONS_TABLE_MODAL).should('exist');
  cy.get(_exceptions.EXCEPTIONS_TABLE_MODAL_CONFIRM_BTN).first().click();
  cy.get(_exceptions.EXCEPTIONS_TABLE_MODAL).should('not.exist');
};

exports.deleteExceptionListWithRuleReference = deleteExceptionListWithRuleReference;

const exportExceptionList = () => {
  cy.get(_exceptions.EXCEPTIONS_TABLE_EXPORT_BTN).first().click();
};

exports.exportExceptionList = exportExceptionList;

const clearSearchSelection = () => {
  cy.get(_exceptions.EXCEPTIONS_TABLE_SEARCH_CLEAR).first().click();
};

exports.clearSearchSelection = clearSearchSelection;