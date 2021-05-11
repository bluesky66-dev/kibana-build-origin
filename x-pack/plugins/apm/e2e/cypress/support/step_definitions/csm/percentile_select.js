"use strict";

var _steps = require("cypress-cucumber-preprocessor/steps");

var _client_metrics_helper = require("./client_metrics_helper");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


(0, _steps.When)('the user changes the selected percentile', () => {
  (0, _utils.waitForLoadingToFinish)();
  (0, _utils.getDataTestSubj)('uxPercentileSelect').select('95');
});
(0, _steps.Then)(`it displays client metric related to that percentile`, () => {
  const metrics = ['165 ms', '14 ms', '151 ms', '55'];
  (0, _client_metrics_helper.verifyClientMetrics)(metrics, false);
  (0, _utils.getDataTestSubj)('uxPercentileSelect').select('50');
});