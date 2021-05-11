"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRoutes = setupRoutes;

var _ui_counters = require("./ui_counters");

var _stats = require("./stats");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function setupRoutes({
  router,
  getSavedObjects,
  ...rest
}) {
  (0, _ui_counters.registerUiCountersRoute)(router, getSavedObjects);
  (0, _stats.registerStatsRoute)({
    router,
    ...rest
  });
}