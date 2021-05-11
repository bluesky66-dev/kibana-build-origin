"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = void 0;

var _std_metric = require("./std_metric");

var _std_sibling = require("./std_sibling");

var _series_agg = require("./series_agg");

var _percentile = require("./percentile");

var _percentile_rank = require("./percentile_rank");

var _math = require("./math");

var _drop_last_bucket = require("./drop_last_bucket");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const processors = [_percentile.percentile, _percentile_rank.percentileRank, _std_metric.stdMetric, _std_sibling.stdSibling, _math.math, _series_agg.seriesAgg, _drop_last_bucket.dropLastBucketFn];
exports.processors = processors;