"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForKibana = exports.saveEditedRule = void 0;

var _edit_rule = require("../screens/edit_rule");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const saveEditedRule = () => {
  cy.get(_edit_rule.EDIT_SUBMIT_BUTTON).should('exist').click({
    force: true
  });
  cy.get(_edit_rule.EDIT_SUBMIT_BUTTON).should('not.exist');
};

exports.saveEditedRule = saveEditedRule;

const waitForKibana = () => {
  cy.get(_edit_rule.KIBANA_LOADING_COMPLETE_INDICATOR).should('exist');
};

exports.waitForKibana = waitForKibana;