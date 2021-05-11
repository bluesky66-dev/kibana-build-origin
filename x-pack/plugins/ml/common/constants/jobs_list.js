"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROGRESS_JOBS_REFRESH_INTERVAL_MS = exports.DELETING_JOBS_REFRESH_INTERVAL_MS = exports.MINIMUM_REFRESH_INTERVAL_MS = exports.DEFAULT_REFRESH_INTERVAL_MS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_REFRESH_INTERVAL_MS = 30000;
exports.DEFAULT_REFRESH_INTERVAL_MS = DEFAULT_REFRESH_INTERVAL_MS;
const MINIMUM_REFRESH_INTERVAL_MS = 1000;
exports.MINIMUM_REFRESH_INTERVAL_MS = MINIMUM_REFRESH_INTERVAL_MS;
const DELETING_JOBS_REFRESH_INTERVAL_MS = 2000;
exports.DELETING_JOBS_REFRESH_INTERVAL_MS = DELETING_JOBS_REFRESH_INTERVAL_MS;
const PROGRESS_JOBS_REFRESH_INTERVAL_MS = 2000;
exports.PROGRESS_JOBS_REFRESH_INTERVAL_MS = PROGRESS_JOBS_REFRESH_INTERVAL_MS;