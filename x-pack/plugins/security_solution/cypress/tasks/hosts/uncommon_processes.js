"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForUncommonProcessesToBeLoaded = void 0;

var _uncommon_processes = require("../../screens/hosts/uncommon_processes");

var _security_header = require("../../screens/security_header");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const waitForUncommonProcessesToBeLoaded = () => {
  cy.get(_uncommon_processes.UNCOMMON_PROCESSES_TABLE).should('exist');
  cy.get(_security_header.REFRESH_BUTTON).should('not.have.text', 'Updating');
};

exports.waitForUncommonProcessesToBeLoaded = waitForUncommonProcessesToBeLoaded;