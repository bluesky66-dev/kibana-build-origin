"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForIpsTableToBeLoaded = void 0;

var _flows = require("../../screens/network/flows");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const waitForIpsTableToBeLoaded = () => {
  cy.get(_flows.IPS_TABLE_LOADED).should('exist');
};

exports.waitForIpsTableToBeLoaded = waitForIpsTableToBeLoaded;