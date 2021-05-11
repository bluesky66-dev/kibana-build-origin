"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dnsMatrixHistogramConfig = void 0;

var _queryDns_histogram = require("./query.dns_histogram.dsl");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const dnsMatrixHistogramConfig = {
  buildDsl: _queryDns_histogram.buildDnsHistogramQuery,
  aggName: 'aggregations.dns_name_query_count.buckets',
  parseKey: 'dns_question_name.buckets',
  parser: _helpers.getDnsParsedData
};
exports.dnsMatrixHistogramConfig = dnsMatrixHistogramConfig;