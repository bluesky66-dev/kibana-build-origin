"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventsMatrixHistogramConfig = void 0;

var _queryEvents_histogram = require("./query.events_histogram.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const eventsMatrixHistogramConfig = {
  buildDsl: _queryEvents_histogram.buildEventsHistogramQuery,
  aggName: 'aggregations.eventActionGroup.buckets',
  parseKey: 'events.buckets'
};
exports.eventsMatrixHistogramConfig = eventsMatrixHistogramConfig;