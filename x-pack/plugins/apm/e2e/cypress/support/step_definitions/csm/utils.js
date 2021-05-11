"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForLoadingToFinish = waitForLoadingToFinish;
exports.getDataTestSubj = getDataTestSubj;

var _csm_dashboard = require("./csm_dashboard");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function waitForLoadingToFinish() {
  cy.get('[data-test-subj=globalLoadingIndicator-hidden]', _csm_dashboard.DEFAULT_TIMEOUT);
}

function getDataTestSubj(dataTestSubj) {
  waitForLoadingToFinish();
  return cy.get(`[data-test-subj=${dataTestSubj}]`, _csm_dashboard.DEFAULT_TIMEOUT);
}