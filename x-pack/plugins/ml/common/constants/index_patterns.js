"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ML_NOTIFICATION_INDEX_PATTERN = exports.ML_RESULTS_INDEX_PATTERN = exports.ML_ANNOTATIONS_INDEX_PATTERN = exports.ML_ANNOTATIONS_INDEX_ALIAS_WRITE = exports.ML_ANNOTATIONS_INDEX_ALIAS_READ = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ML_ANNOTATIONS_INDEX_ALIAS_READ = '.ml-annotations-read';
exports.ML_ANNOTATIONS_INDEX_ALIAS_READ = ML_ANNOTATIONS_INDEX_ALIAS_READ;
const ML_ANNOTATIONS_INDEX_ALIAS_WRITE = '.ml-annotations-write';
exports.ML_ANNOTATIONS_INDEX_ALIAS_WRITE = ML_ANNOTATIONS_INDEX_ALIAS_WRITE;
const ML_ANNOTATIONS_INDEX_PATTERN = '.ml-annotations-6';
exports.ML_ANNOTATIONS_INDEX_PATTERN = ML_ANNOTATIONS_INDEX_PATTERN;
const ML_RESULTS_INDEX_PATTERN = '.ml-anomalies-*';
exports.ML_RESULTS_INDEX_PATTERN = ML_RESULTS_INDEX_PATTERN;
const ML_NOTIFICATION_INDEX_PATTERN = '.ml-notifications*';
exports.ML_NOTIFICATION_INDEX_PATTERN = ML_NOTIFICATION_INDEX_PATTERN;