"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraMetricModelMetricType = exports.InfraMetricModelQueryType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let InfraMetricModelQueryType;
exports.InfraMetricModelQueryType = InfraMetricModelQueryType;

(function (InfraMetricModelQueryType) {
  InfraMetricModelQueryType["lucene"] = "lucene";
  InfraMetricModelQueryType["kuery"] = "kuery";
})(InfraMetricModelQueryType || (exports.InfraMetricModelQueryType = InfraMetricModelQueryType = {}));

let InfraMetricModelMetricType;
exports.InfraMetricModelMetricType = InfraMetricModelMetricType;

(function (InfraMetricModelMetricType) {
  InfraMetricModelMetricType["avg"] = "avg";
  InfraMetricModelMetricType["max"] = "max";
  InfraMetricModelMetricType["min"] = "min";
  InfraMetricModelMetricType["calculation"] = "calculation";
  InfraMetricModelMetricType["cardinality"] = "cardinality";
  InfraMetricModelMetricType["series_agg"] = "series_agg";
  InfraMetricModelMetricType["positive_only"] = "positive_only";
  InfraMetricModelMetricType["derivative"] = "derivative";
  InfraMetricModelMetricType["count"] = "count";
  InfraMetricModelMetricType["sum"] = "sum";
  InfraMetricModelMetricType["cumulative_sum"] = "cumulative_sum";
})(InfraMetricModelMetricType || (exports.InfraMetricModelMetricType = InfraMetricModelMetricType = {}));