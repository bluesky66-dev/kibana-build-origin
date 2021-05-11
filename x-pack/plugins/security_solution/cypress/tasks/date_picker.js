"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTimelineDates = exports.updateDates = exports.setTimelineStartDate = exports.setTimelineEndDate = exports.setStartDate = exports.setEndDate = void 0;

var _date_picker = require("../screens/date_picker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const setEndDate = date => {
  cy.get(_date_picker.DATE_PICKER_END_DATE_POPOVER_BUTTON).click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_TAB).first().click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_INPUT).clear().type(date);
};

exports.setEndDate = setEndDate;

const setStartDate = date => {
  cy.get(_date_picker.DATE_PICKER_START_DATE_POPOVER_BUTTON).click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_TAB).first().click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_INPUT).clear().type(date);
};

exports.setStartDate = setStartDate;

const setTimelineEndDate = date => {
  cy.get(_date_picker.DATE_PICKER_END_DATE_POPOVER_BUTTON_TIMELINE).first().click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_TAB).first().click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_INPUT).click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_INPUT).then($el => {
    if (Cypress.dom.isAttached($el)) {
      cy.wrap($el).click({
        force: true
      });
    }

    cy.wrap($el).type(`{selectall}{backspace}${date}{enter}`);
  });
};

exports.setTimelineEndDate = setTimelineEndDate;

const setTimelineStartDate = date => {
  cy.get(_date_picker.DATE_PICKER_START_DATE_POPOVER_BUTTON_TIMELINE).first().click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_TAB).first().click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_INPUT).click({
    force: true
  });
  cy.get(_date_picker.DATE_PICKER_ABSOLUTE_INPUT).then($el => {
    if (Cypress.dom.isAttached($el)) {
      cy.wrap($el).click({
        force: true
      });
    }

    cy.wrap($el).type(`{selectall}{backspace}${date}{enter}`);
  });
};

exports.setTimelineStartDate = setTimelineStartDate;

const updateDates = () => {
  cy.get(_date_picker.DATE_PICKER_APPLY_BUTTON).click({
    force: true
  }).should('not.have.text', 'Updating');
};

exports.updateDates = updateDates;

const updateTimelineDates = () => {
  cy.get(_date_picker.DATE_PICKER_APPLY_BUTTON_TIMELINE).first().click({
    force: true
  }).should('not.have.text', 'Updating');
};

exports.updateTimelineDates = updateTimelineDates;