"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openStatsAndTables = exports.closesModal = void 0;

var _inspect = require("../screens/inspect");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const closesModal = () => {
  cy.get('[data-test-subj="modal-inspect-close"]').click();
};

exports.closesModal = closesModal;

const openStatsAndTables = table => {
  if (table.tabId) {
    cy.get(table.tabId).click({
      force: true
    });
  }

  cy.get(table.id);

  if (table.altInspectId) {
    cy.get(table.altInspectId).trigger('click', {
      force: true
    });
  } else {
    cy.get(`${table.id} ${_inspect.INSPECT_BUTTON_ICON}`).trigger('click', {
      force: true
    });
  }
};

exports.openStatsAndTables = openStatsAndTables;