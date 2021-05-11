"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = void 0;

var _pivot = require("./pivot");

var _query = require("./query");

var _split_by_everything = require("./split_by_everything");

var _split_by_terms = require("./split_by_terms");

var _date_histogram = require("./date_histogram");

var _metric_buckets = require("./metric_buckets");

var _sibling_buckets = require("./sibling_buckets");

var _filter_ratios = require("./filter_ratios");

var _normalize_query = require("./normalize_query");

var _positive_rate = require("./positive_rate");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const processors = [_query.query, _pivot.pivot, _split_by_terms.splitByTerms, _split_by_everything.splitByEverything, _date_histogram.dateHistogram, _metric_buckets.metricBuckets, _sibling_buckets.siblingBuckets, _filter_ratios.ratios, _positive_rate.positiveRate, _normalize_query.normalizeQuery];
exports.processors = processors;