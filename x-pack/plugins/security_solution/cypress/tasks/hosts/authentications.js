"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForAuthenticationsToBeLoaded = void 0;

var _authentications = require("../../screens/hosts/authentications");

var _security_header = require("../../screens/security_header");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const waitForAuthenticationsToBeLoaded = () => {
  cy.get(_authentications.AUTHENTICATIONS_TABLE).should('exist');
  cy.get(_security_header.REFRESH_BUTTON).should('not.have.text', 'Updating');
};

exports.waitForAuthenticationsToBeLoaded = waitForAuthenticationsToBeLoaded;