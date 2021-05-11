"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UI_COUNTERS_KEEP_DOCS_FOR_DAYS = exports.ROLL_INDICES_START = exports.ROLL_INDICES_INTERVAL = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Roll indices every 24h
 */
const ROLL_INDICES_INTERVAL = 24 * 60 * 60 * 1000;
/**
 * Start rolling indices after 5 minutes up
 */

exports.ROLL_INDICES_INTERVAL = ROLL_INDICES_INTERVAL;
const ROLL_INDICES_START = 5 * 60 * 1000;
/**
 * Number of days to keep the UI counters saved object documents
 */

exports.ROLL_INDICES_START = ROLL_INDICES_START;
const UI_COUNTERS_KEEP_DOCS_FOR_DAYS = 3;
exports.UI_COUNTERS_KEEP_DOCS_FOR_DAYS = UI_COUNTERS_KEEP_DOCS_FOR_DAYS;