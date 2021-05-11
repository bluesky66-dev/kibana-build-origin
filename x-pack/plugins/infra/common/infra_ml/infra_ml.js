"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExampleDataIndex = exports.isSetupStatusWithResults = exports.isHealthyJobStatus = exports.isJobStatusWithResults = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// combines and abstracts job and datafeed status
// setup is not necessary

/**
 * Maps a job status to the possibility that results have already been produced
 * before this state was reached.
 */

const isJobStatusWithResults = jobStatus => ['started', 'finished', 'stopped', 'failed'].includes(jobStatus);

exports.isJobStatusWithResults = isJobStatusWithResults;

const isHealthyJobStatus = jobStatus => ['started', 'finished'].includes(jobStatus);
/**
 * Maps a setup status to the possibility that results have already been
 * produced before this state was reached.
 */


exports.isHealthyJobStatus = isHealthyJobStatus;

const isSetupStatusWithResults = setupStatus => setupStatus.type === 'skipped';

exports.isSetupStatusWithResults = isSetupStatusWithResults;
const KIBANA_SAMPLE_DATA_INDICES = ['kibana_sample_data_logs*'];

const isExampleDataIndex = indexName => KIBANA_SAMPLE_DATA_INDICES.includes(indexName);

exports.isExampleDataIndex = isExampleDataIndex;