"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONDITIONS_NOT_SUPPORTED_FUNCTIONS = exports.OPERATOR = exports.APPLIES_TO = exports.FILTER_TYPE = exports.ACTION = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Contains values for ML job detector rules.
 */

let ACTION;
exports.ACTION = ACTION;

(function (ACTION) {
  ACTION["SKIP_MODEL_UPDATE"] = "skip_model_update";
  ACTION["SKIP_RESULT"] = "skip_result";
})(ACTION || (exports.ACTION = ACTION = {}));

let FILTER_TYPE;
exports.FILTER_TYPE = FILTER_TYPE;

(function (FILTER_TYPE) {
  FILTER_TYPE["EXCLUDE"] = "exclude";
  FILTER_TYPE["INCLUDE"] = "include";
})(FILTER_TYPE || (exports.FILTER_TYPE = FILTER_TYPE = {}));

let APPLIES_TO;
exports.APPLIES_TO = APPLIES_TO;

(function (APPLIES_TO) {
  APPLIES_TO["ACTUAL"] = "actual";
  APPLIES_TO["DIFF_FROM_TYPICAL"] = "diff_from_typical";
  APPLIES_TO["TYPICAL"] = "typical";
})(APPLIES_TO || (exports.APPLIES_TO = APPLIES_TO = {}));

let OPERATOR; // List of detector functions which don't support rules with numeric conditions.

exports.OPERATOR = OPERATOR;

(function (OPERATOR) {
  OPERATOR["LESS_THAN"] = "lt";
  OPERATOR["LESS_THAN_OR_EQUAL"] = "lte";
  OPERATOR["GREATER_THAN"] = "gt";
  OPERATOR["GREATER_THAN_OR_EQUAL"] = "gte";
})(OPERATOR || (exports.OPERATOR = OPERATOR = {}));

const CONDITIONS_NOT_SUPPORTED_FUNCTIONS = ['freq_rare', 'lat_long', 'metric', 'rare'];
exports.CONDITIONS_NOT_SUPPORTED_FUNCTIONS = CONDITIONS_NOT_SUPPORTED_FUNCTIONS;