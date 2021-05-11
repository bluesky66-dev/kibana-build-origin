"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobServiceProvider = jobServiceProvider;

var _datafeeds = require("./datafeeds");

var _jobs = require("./jobs");

var _groups = require("./groups");

var _new_job_caps = require("./new_job_caps");

var _new_job = require("./new_job");

var _model_snapshots = require("./model_snapshots");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function jobServiceProvider(client, mlClient) {
  return { ...(0, _datafeeds.datafeedsProvider)(mlClient),
    ...(0, _jobs.jobsProvider)(client, mlClient),
    ...(0, _groups.groupsProvider)(mlClient),
    ...(0, _new_job_caps.newJobCapsProvider)(client),
    ...(0, _new_job.newJobChartsProvider)(client),
    ...(0, _new_job.topCategoriesProvider)(mlClient),
    ...(0, _model_snapshots.modelSnapshotProvider)(mlClient)
  };
}