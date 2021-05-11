"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCombinedJobWithStats = isCombinedJobWithStats;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// in older implementations of the job config, the datafeed was placed inside the job
// for convenience.

function isCombinedJobWithStats(arg) {
  return typeof arg.job_id === 'string';
}