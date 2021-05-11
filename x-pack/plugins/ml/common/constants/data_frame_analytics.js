"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUILT_IN_MODEL_TAG = exports.JOB_MAP_NODE_TYPES = exports.DEFAULT_RESULTS_FIELD = exports.DATA_FRAME_TASK_STATE = exports.ANALYSIS_CONFIG_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ANALYSIS_CONFIG_TYPE = {
  OUTLIER_DETECTION: 'outlier_detection',
  REGRESSION: 'regression',
  CLASSIFICATION: 'classification'
};
exports.ANALYSIS_CONFIG_TYPE = ANALYSIS_CONFIG_TYPE;
const DATA_FRAME_TASK_STATE = {
  ANALYZING: 'analyzing',
  FAILED: 'failed',
  REINDEXING: 'reindexing',
  STARTED: 'started',
  STARTING: 'starting',
  STOPPED: 'stopped'
};
exports.DATA_FRAME_TASK_STATE = DATA_FRAME_TASK_STATE;
const DEFAULT_RESULTS_FIELD = 'ml';
exports.DEFAULT_RESULTS_FIELD = DEFAULT_RESULTS_FIELD;
const JOB_MAP_NODE_TYPES = {
  ANALYTICS: 'analytics',
  TRANSFORM: 'transform',
  INDEX: 'index',
  TRAINED_MODEL: 'trainedModel'
};
exports.JOB_MAP_NODE_TYPES = JOB_MAP_NODE_TYPES;
const BUILT_IN_MODEL_TAG = 'prepackaged';
exports.BUILT_IN_MODEL_TAG = BUILT_IN_MODEL_TAG;