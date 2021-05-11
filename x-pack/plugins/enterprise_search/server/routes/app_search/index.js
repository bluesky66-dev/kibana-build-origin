"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAppSearchRoutes = void 0;

var _analytics = require("./analytics");

var _credentials = require("./credentials");

var _curations = require("./curations");

var _documents = require("./documents");

var _engines = require("./engines");

var _search_settings = require("./search_settings");

var _settings = require("./settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerAppSearchRoutes = dependencies => {
  (0, _engines.registerEnginesRoutes)(dependencies);
  (0, _credentials.registerCredentialsRoutes)(dependencies);
  (0, _settings.registerSettingsRoutes)(dependencies);
  (0, _analytics.registerAnalyticsRoutes)(dependencies);
  (0, _documents.registerDocumentsRoutes)(dependencies);
  (0, _documents.registerDocumentRoutes)(dependencies);
  (0, _curations.registerCurationsRoutes)(dependencies);
  (0, _search_settings.registerSearchSettingsRoutes)(dependencies);
};

exports.registerAppSearchRoutes = registerAppSearchRoutes;