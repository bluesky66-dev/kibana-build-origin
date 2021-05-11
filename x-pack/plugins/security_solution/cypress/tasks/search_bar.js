"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillAddFilterForm = exports.openAddFilterPopover = void 0;

var _search_bar = require("../screens/search_bar");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const openAddFilterPopover = () => {
  cy.get(_search_bar.GLOBAL_SEARCH_BAR_SUBMIT_BUTTON).should('be.enabled');
  cy.get(_search_bar.GLOBAL_SEARCH_BAR_ADD_FILTER).should('be.visible');
  cy.get(_search_bar.GLOBAL_SEARCH_BAR_ADD_FILTER).click();
};

exports.openAddFilterPopover = openAddFilterPopover;

const fillAddFilterForm = ({
  key,
  value
}) => {
  cy.get(_search_bar.ADD_FILTER_FORM_FIELD_INPUT).should('exist');
  cy.get(_search_bar.ADD_FILTER_FORM_FIELD_INPUT).should('be.visible');
  cy.get(_search_bar.ADD_FILTER_FORM_FIELD_INPUT).type(key);
  cy.get(_search_bar.ADD_FILTER_FORM_FIELD_INPUT).click();
  cy.get((0, _search_bar.ADD_FILTER_FORM_FIELD_OPTION)(key)).click({
    force: true
  });
  cy.get(_search_bar.ADD_FILTER_FORM_OPERATOR_FIELD).click();
  cy.get(_search_bar.ADD_FILTER_FORM_OPERATOR_OPTION_IS).click();
  cy.get(_search_bar.ADD_FILTER_FORM_FILTER_VALUE_INPUT).type(value);
  cy.get(_search_bar.ADD_FILTER_FORM_SAVE_BUTTON).click();
  cy.get(_search_bar.ADD_FILTER_FORM_SAVE_BUTTON).should('not.exist');
};

exports.fillAddFilterForm = fillAddFilterForm;