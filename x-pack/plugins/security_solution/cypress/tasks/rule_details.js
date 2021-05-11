"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goBackToAllRulesTable = exports.waitForTheRuleToBeExecuted = exports.removeException = exports.goToExceptionsTab = exports.goToAlertsTab = exports.addsExceptionFromRuleSettings = exports.openExceptionModalFromRuleSettings = exports.addsException = exports.activatesRule = void 0;

var _create_new_rule = require("../screens/create_new_rule");

var _exceptions = require("../screens/exceptions");

var _rule_details = require("../screens/rule_details");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const activatesRule = () => {
  cy.intercept('PATCH', '/api/detection_engine/rules/_bulk_update').as('bulk_update');
  cy.get(_rule_details.RULE_SWITCH).should('be.visible');
  cy.get(_rule_details.RULE_SWITCH).click();
  cy.wait('@bulk_update').then(({
    response
  }) => {
    cy.wrap(response.statusCode).should('eql', 200);
  });
};

exports.activatesRule = activatesRule;

const addsException = exception => {
  cy.get(_exceptions.LOADING_SPINNER).should('exist');
  cy.get(_exceptions.LOADING_SPINNER).should('not.exist');
  cy.get(_exceptions.FIELD_INPUT).should('exist');
  cy.get(_exceptions.FIELD_INPUT).type(`${exception.field}{enter}`);
  cy.get(_exceptions.OPERATOR_INPUT).type(`${exception.operator}{enter}`);
  exception.values.forEach(value => {
    cy.get(_exceptions.VALUES_INPUT).type(`${value}{enter}`);
  });
  cy.get(_exceptions.CLOSE_ALERTS_CHECKBOX).click({
    force: true
  });
  cy.get(_exceptions.CONFIRM_BTN).click();
  cy.get(_exceptions.CONFIRM_BTN).should('have.attr', 'disabled');
  cy.get(_exceptions.CONFIRM_BTN).should('not.exist');
};

exports.addsException = addsException;

const openExceptionModalFromRuleSettings = () => {
  cy.get(_exceptions.ADD_EXCEPTIONS_BTN).click();
  cy.get(_exceptions.LOADING_SPINNER).should('not.exist');
  cy.get(_exceptions.FIELD_INPUT).should('be.visible');
};

exports.openExceptionModalFromRuleSettings = openExceptionModalFromRuleSettings;

const addsExceptionFromRuleSettings = exception => {
  cy.get(_exceptions.ADD_EXCEPTIONS_BTN).click();
  cy.get(_exceptions.LOADING_SPINNER).should('exist');
  cy.get(_exceptions.LOADING_SPINNER).should('not.exist');
  cy.get(_exceptions.LOADING_SPINNER).should('exist');
  cy.get(_exceptions.LOADING_SPINNER).should('not.exist');
  cy.get(_exceptions.FIELD_INPUT).should('be.visible');
  cy.get(_exceptions.FIELD_INPUT).type(`${exception.field}{enter}`);
  cy.get(_exceptions.OPERATOR_INPUT).type(`${exception.operator}{enter}`);
  exception.values.forEach(value => {
    cy.get(_exceptions.VALUES_INPUT).type(`${value}{enter}`);
  });
  cy.get(_exceptions.CLOSE_ALERTS_CHECKBOX).click({
    force: true
  });
  cy.get(_exceptions.CONFIRM_BTN).click();
  cy.get(_exceptions.CONFIRM_BTN).should('have.attr', 'disabled');
  cy.get(_exceptions.CONFIRM_BTN).should('not.exist');
};

exports.addsExceptionFromRuleSettings = addsExceptionFromRuleSettings;

const goToAlertsTab = () => {
  cy.get(_rule_details.ALERTS_TAB).click();
};

exports.goToAlertsTab = goToAlertsTab;

const goToExceptionsTab = () => {
  cy.get(_rule_details.EXCEPTIONS_TAB).click();
};

exports.goToExceptionsTab = goToExceptionsTab;

const removeException = () => {
  cy.get(_rule_details.REMOVE_EXCEPTION_BTN).click();
};

exports.removeException = removeException;

const waitForTheRuleToBeExecuted = async () => {
  let status = '';

  while (status !== 'succeeded') {
    cy.get(_rule_details.REFRESH_BUTTON).click({
      force: true
    });
    status = await cy.get(_create_new_rule.RULE_STATUS).invoke('text').promisify();
  }
};

exports.waitForTheRuleToBeExecuted = waitForTheRuleToBeExecuted;

const goBackToAllRulesTable = () => {
  cy.get(_rule_details.BACK_TO_RULES).click();
};

exports.goBackToAllRulesTable = goBackToAllRulesTable;