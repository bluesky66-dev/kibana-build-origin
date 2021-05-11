"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SHARED_RESULTS_INDEX_NAME = exports.DEFAULT_QUERY_DELAY = exports.DEFAULT_RARE_BUCKET_SPAN = exports.DEFAULT_BUCKET_SPAN = exports.DEFAULT_MODEL_MEMORY_LIMIT = exports.CREATED_BY_LABEL = exports.JOB_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let JOB_TYPE;
exports.JOB_TYPE = JOB_TYPE;

(function (JOB_TYPE) {
  JOB_TYPE["SINGLE_METRIC"] = "single_metric";
  JOB_TYPE["MULTI_METRIC"] = "multi_metric";
  JOB_TYPE["POPULATION"] = "population";
  JOB_TYPE["ADVANCED"] = "advanced";
  JOB_TYPE["CATEGORIZATION"] = "categorization";
})(JOB_TYPE || (exports.JOB_TYPE = JOB_TYPE = {}));

let CREATED_BY_LABEL;
exports.CREATED_BY_LABEL = CREATED_BY_LABEL;

(function (CREATED_BY_LABEL) {
  CREATED_BY_LABEL["SINGLE_METRIC"] = "single-metric-wizard";
  CREATED_BY_LABEL["MULTI_METRIC"] = "multi-metric-wizard";
  CREATED_BY_LABEL["POPULATION"] = "population-wizard";
  CREATED_BY_LABEL["CATEGORIZATION"] = "categorization-wizard";
  CREATED_BY_LABEL["APM_TRANSACTION"] = "ml-module-apm-transaction";
})(CREATED_BY_LABEL || (exports.CREATED_BY_LABEL = CREATED_BY_LABEL = {}));

const DEFAULT_MODEL_MEMORY_LIMIT = '10MB';
exports.DEFAULT_MODEL_MEMORY_LIMIT = DEFAULT_MODEL_MEMORY_LIMIT;
const DEFAULT_BUCKET_SPAN = '15m';
exports.DEFAULT_BUCKET_SPAN = DEFAULT_BUCKET_SPAN;
const DEFAULT_RARE_BUCKET_SPAN = '1h';
exports.DEFAULT_RARE_BUCKET_SPAN = DEFAULT_RARE_BUCKET_SPAN;
const DEFAULT_QUERY_DELAY = '60s';
exports.DEFAULT_QUERY_DELAY = DEFAULT_QUERY_DELAY;
const SHARED_RESULTS_INDEX_NAME = 'shared';
exports.SHARED_RESULTS_INDEX_NAME = SHARED_RESULTS_INDEX_NAME;