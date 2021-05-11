"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = void 0;

var _query = require("./query");

var _date_histogram = require("./date_histogram");

var _top_hits = require("./top_hits");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const processors = [_query.query, _date_histogram.dateHistogram, _top_hits.topHits];
exports.processors = processors;