"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXTENDED_STATS_TYPES = exports.BUCKET_TYPES = exports.METRIC_TYPES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// We should probably use METRIC_TYPES from data plugin in future.
let METRIC_TYPES; // We should probably use BUCKET_TYPES from data plugin in future.

exports.METRIC_TYPES = METRIC_TYPES;

(function (METRIC_TYPES) {
  METRIC_TYPES["PERCENTILE"] = "percentile";
  METRIC_TYPES["PERCENTILE_RANK"] = "percentile_rank";
  METRIC_TYPES["TOP_HIT"] = "top_hit";
  METRIC_TYPES["COUNT"] = "count";
  METRIC_TYPES["DERIVATIVE"] = "derivative";
  METRIC_TYPES["STD_DEVIATION"] = "std_deviation";
  METRIC_TYPES["VARIANCE"] = "variance";
  METRIC_TYPES["SUM_OF_SQUARES"] = "sum_of_squares";
  METRIC_TYPES["CARDINALITY"] = "cardinality";
  METRIC_TYPES["VALUE_COUNT"] = "value_count";
  METRIC_TYPES["AVERAGE"] = "avg";
  METRIC_TYPES["SUM"] = "sum";
  METRIC_TYPES["MIN"] = "min";
  METRIC_TYPES["MAX"] = "max";
})(METRIC_TYPES || (exports.METRIC_TYPES = METRIC_TYPES = {}));

let BUCKET_TYPES;
exports.BUCKET_TYPES = BUCKET_TYPES;

(function (BUCKET_TYPES) {
  BUCKET_TYPES["TERMS"] = "terms";
})(BUCKET_TYPES || (exports.BUCKET_TYPES = BUCKET_TYPES = {}));

const EXTENDED_STATS_TYPES = [METRIC_TYPES.STD_DEVIATION, METRIC_TYPES.VARIANCE, METRIC_TYPES.SUM_OF_SQUARES];
exports.EXTENDED_STATS_TYPES = EXTENDED_STATS_TYPES;