"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticationsMatrixHistogramConfig = void 0;

var _queryAuthentications_histogram = require("./query.authentications_histogram.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const authenticationsMatrixHistogramConfig = {
  buildDsl: _queryAuthentications_histogram.buildAuthenticationsHistogramQuery,
  aggName: 'aggregations.eventActionGroup.buckets',
  parseKey: 'events.buckets'
};
exports.authenticationsMatrixHistogramConfig = authenticationsMatrixHistogramConfig;