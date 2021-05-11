"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dismissCallOut = exports.waitForCallOutToBeShown = exports.getCallOut = void 0;

var _callouts = require("../../screens/common/callouts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCallOut = (id, options) => {
  return cy.get((0, _callouts.callOutWithId)(id), options);
};

exports.getCallOut = getCallOut;

const waitForCallOutToBeShown = (id, color) => {
  getCallOut(id).should('be.visible').should('have.class', `euiCallOut--${color}`);
};

exports.waitForCallOutToBeShown = waitForCallOutToBeShown;

const dismissCallOut = id => {
  getCallOut(id).within(() => {
    cy.get(_callouts.CALLOUT_DISMISS_BTN).should('be.visible').click();
    cy.root().should('not.exist');
  });
};

exports.dismissCallOut = dismissCallOut;