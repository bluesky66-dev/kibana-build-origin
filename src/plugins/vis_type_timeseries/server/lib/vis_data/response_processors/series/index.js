"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = void 0;

var _percentile = require("./percentile");

var _percentile_rank = require("./percentile_rank");

var _series_agg = require("./series_agg");

var _std_deviation_bands = require("./std_deviation_bands");

var _std_deviation_sibling = require("./std_deviation_sibling");

var _std_metric = require("./std_metric");

var _std_sibling = require("./std_sibling");

var _time_shift = require("./time_shift");

var _drop_last_bucket = require("./drop_last_bucket");

var _math = require("./math");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const processors = [_percentile.percentile, _percentile_rank.percentileRank, _std_deviation_bands.stdDeviationBands, _std_deviation_sibling.stdDeviationSibling, _std_metric.stdMetric, _std_sibling.stdSibling, _math.mathAgg, _series_agg.seriesAgg, _time_shift.timeShift, _drop_last_bucket.dropLastBucket];
exports.processors = processors;