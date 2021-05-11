"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeExceptionBuilderModal = exports.addNestedExceptionEntry = exports.addExceptionEntry = exports.addExceptionEntryValue = exports.addExceptionEntryOperatorValue = exports.addExceptionEntryFieldValue = exports.addExceptionEntryFieldValueOfItemX = void 0;

var _exceptions = require("../screens/exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addExceptionEntryFieldValueOfItemX = (field, itemIndex = 0, fieldIndex = 0) => {
  cy.get(_exceptions.EXCEPTION_ITEM_CONTAINER).eq(itemIndex).find(_exceptions.FIELD_INPUT).eq(fieldIndex).type(`${field}{enter}`);
  cy.get(_exceptions.BUILDER_MODAL_BODY).click();
};

exports.addExceptionEntryFieldValueOfItemX = addExceptionEntryFieldValueOfItemX;

const addExceptionEntryFieldValue = (field, index = 0) => {
  cy.get(_exceptions.FIELD_INPUT).eq(index).type(`${field}{enter}`);
  cy.get(_exceptions.BUILDER_MODAL_BODY).click();
};

exports.addExceptionEntryFieldValue = addExceptionEntryFieldValue;

const addExceptionEntryOperatorValue = (operator, index = 0) => {
  cy.get(_exceptions.OPERATOR_INPUT).eq(index).type(`${operator}{enter}`);
  cy.get(_exceptions.BUILDER_MODAL_BODY).click();
};

exports.addExceptionEntryOperatorValue = addExceptionEntryOperatorValue;

const addExceptionEntryValue = (values, index = 0) => {
  values.forEach(value => {
    cy.get(_exceptions.VALUES_INPUT).eq(index).type(`${value}{enter}`);
  });
  cy.get(_exceptions.BUILDER_MODAL_BODY).click();
};

exports.addExceptionEntryValue = addExceptionEntryValue;

const addExceptionEntry = (exception, index = 0) => {
  addExceptionEntryFieldValue(exception.field, index);
  addExceptionEntryOperatorValue(exception.operator, index);
  addExceptionEntryValue(exception.values, index);
};

exports.addExceptionEntry = addExceptionEntry;

const addNestedExceptionEntry = (exception, index = 0) => {
  addExceptionEntryFieldValue(exception.field, index);
  addExceptionEntryOperatorValue(exception.operator, index);
  addExceptionEntryValue(exception.values, index);
};

exports.addNestedExceptionEntry = addNestedExceptionEntry;

const closeExceptionBuilderModal = () => {
  cy.get(_exceptions.CANCEL_BTN).click();
};

exports.closeExceptionBuilderModal = closeExceptionBuilderModal;