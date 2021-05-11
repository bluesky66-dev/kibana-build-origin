"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMlRule = exports.isJobFailed = exports.isJobLoading = exports.isJobStarted = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Based on ML Job/Datafeed States from x-pack/legacy/plugins/ml/common/constants/states.js

const enabledStates = ['started', 'opened'];
const loadingStates = ['starting', 'stopping', 'opening', 'closing'];
const failureStates = ['deleted', 'failed'];

const isJobStarted = (jobState, datafeedState) => {
  return enabledStates.includes(jobState) && enabledStates.includes(datafeedState);
};

exports.isJobStarted = isJobStarted;

const isJobLoading = (jobState, datafeedState) => {
  return loadingStates.includes(jobState) || loadingStates.includes(datafeedState);
};

exports.isJobLoading = isJobLoading;

const isJobFailed = (jobState, datafeedState) => {
  return failureStates.includes(jobState) || failureStates.includes(datafeedState);
};

exports.isJobFailed = isJobFailed;

const isMlRule = ruleType => ruleType === 'machine_learning';

exports.isMlRule = isMlRule;