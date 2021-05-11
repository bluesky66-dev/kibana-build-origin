"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDiagnosticRoutes = void 0;

var _browser = require("./browser");

var _config = require("./config");

var _screenshot = require("./screenshot");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDiagnosticRoutes = (reporting, logger) => {
  (0, _browser.registerDiagnoseBrowser)(reporting, logger);
  (0, _config.registerDiagnoseConfig)(reporting, logger);
  (0, _screenshot.registerDiagnoseScreenshot)(reporting, logger);
};

exports.registerDiagnosticRoutes = registerDiagnosticRoutes;