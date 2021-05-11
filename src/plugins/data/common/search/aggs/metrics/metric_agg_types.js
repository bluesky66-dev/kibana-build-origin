"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.METRIC_TYPES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let METRIC_TYPES;
exports.METRIC_TYPES = METRIC_TYPES;

(function (METRIC_TYPES) {
  METRIC_TYPES["AVG"] = "avg";
  METRIC_TYPES["CARDINALITY"] = "cardinality";
  METRIC_TYPES["AVG_BUCKET"] = "avg_bucket";
  METRIC_TYPES["MAX_BUCKET"] = "max_bucket";
  METRIC_TYPES["MIN_BUCKET"] = "min_bucket";
  METRIC_TYPES["SUM_BUCKET"] = "sum_bucket";
  METRIC_TYPES["COUNT"] = "count";
  METRIC_TYPES["CUMULATIVE_SUM"] = "cumulative_sum";
  METRIC_TYPES["DERIVATIVE"] = "derivative";
  METRIC_TYPES["GEO_BOUNDS"] = "geo_bounds";
  METRIC_TYPES["GEO_CENTROID"] = "geo_centroid";
  METRIC_TYPES["MEDIAN"] = "median";
  METRIC_TYPES["MIN"] = "min";
  METRIC_TYPES["MAX"] = "max";
  METRIC_TYPES["MOVING_FN"] = "moving_avg";
  METRIC_TYPES["SERIAL_DIFF"] = "serial_diff";
  METRIC_TYPES["SUM"] = "sum";
  METRIC_TYPES["TOP_HITS"] = "top_hits";
  METRIC_TYPES["PERCENTILES"] = "percentiles";
  METRIC_TYPES["PERCENTILE_RANKS"] = "percentile_ranks";
  METRIC_TYPES["STD_DEV"] = "std_dev";
})(METRIC_TYPES || (exports.METRIC_TYPES = METRIC_TYPES = {}));