"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PANEL_TYPES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let PANEL_TYPES;
exports.PANEL_TYPES = PANEL_TYPES;

(function (PANEL_TYPES) {
  PANEL_TYPES["TABLE"] = "table";
  PANEL_TYPES["GAUGE"] = "gauge";
  PANEL_TYPES["MARKDOWN"] = "markdown";
  PANEL_TYPES["TOP_N"] = "top_n";
  PANEL_TYPES["TIMESERIES"] = "timeseries";
  PANEL_TYPES["METRIC"] = "metric";
})(PANEL_TYPES || (exports.PANEL_TYPES = PANEL_TYPES = {}));