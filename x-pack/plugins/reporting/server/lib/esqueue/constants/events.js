"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const events = {
  EVENT_QUEUE_ERROR: 'queue:error',
  EVENT_JOB_ERROR: 'job:error',
  EVENT_JOB_CREATED: 'job:created',
  EVENT_JOB_CREATE_ERROR: 'job:creation error',
  EVENT_WORKER_COMPLETE: 'worker:job complete',
  EVENT_WORKER_JOB_CLAIM_ERROR: 'worker:claim job error',
  EVENT_WORKER_JOB_SEARCH_ERROR: 'worker:pending jobs error',
  EVENT_WORKER_JOB_UPDATE_ERROR: 'worker:update job error',
  EVENT_WORKER_JOB_FAIL: 'worker:job failed',
  EVENT_WORKER_JOB_FAIL_ERROR: 'worker:failed job update error',
  EVENT_WORKER_JOB_EXECUTION_ERROR: 'worker:job execution error',
  EVENT_WORKER_JOB_TIMEOUT: 'worker:job timeout'
};
exports.events = events;