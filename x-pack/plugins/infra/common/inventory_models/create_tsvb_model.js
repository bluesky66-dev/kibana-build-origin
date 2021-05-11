"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTSVBModel = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createTSVBModel = (id, requires, series, interval = '>=300s', dropLastBucket = true) => (timeField, indexPattern) => ({
  id,
  requires,
  drop_last_bucket: dropLastBucket,
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series
});

exports.createTSVBModel = createTSVBModel;