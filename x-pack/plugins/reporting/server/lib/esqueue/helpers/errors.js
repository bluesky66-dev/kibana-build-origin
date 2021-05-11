"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerTimeoutError = WorkerTimeoutError;
exports.UnspecifiedWorkerError = UnspecifiedWorkerError;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function WorkerTimeoutError(message, props = {}) {
  this.name = 'WorkerTimeoutError';
  this.message = message;
  this.timeout = props.timeout;
  this.jobId = props.jobId;
  if ('captureStackTrace' in Error) Error.captureStackTrace(this, WorkerTimeoutError);else this.stack = new Error().stack;
}

WorkerTimeoutError.prototype = Object.create(Error.prototype);

function UnspecifiedWorkerError(message, props = {}) {
  this.name = 'UnspecifiedWorkerError';
  this.message = message;
  this.jobId = props.jobId;
  if ('captureStackTrace' in Error) Error.captureStackTrace(this, UnspecifiedWorkerError);else this.stack = new Error().stack;
}

UnspecifiedWorkerError.prototype = Object.create(Error.prototype);