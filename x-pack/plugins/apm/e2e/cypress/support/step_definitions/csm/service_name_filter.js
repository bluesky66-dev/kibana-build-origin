"use strict";

var _steps = require("cypress-cucumber-preprocessor/steps");

var _client_metrics_helper = require("./client_metrics_helper");

var _csm_dashboard = require("./csm_dashboard");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


(0, _steps.When)('the user changes the selected service name', () => {
  (0, _utils.waitForLoadingToFinish)();
  cy.get(`[data-cy=serviceNameFilter]`, _csm_dashboard.DEFAULT_TIMEOUT).select('client');
});
(0, _steps.Then)(`it displays relevant client metrics`, () => {
  const metrics = ['80 ms', '4 ms', '76 ms', '55'];
  (0, _client_metrics_helper.verifyClientMetrics)(metrics, false);
});