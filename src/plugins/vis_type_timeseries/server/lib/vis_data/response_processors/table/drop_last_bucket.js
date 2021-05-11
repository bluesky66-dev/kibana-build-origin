"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropLastBucketFn = dropLastBucketFn;

var _drop_last_bucket = require("../series/drop_last_bucket");

var _get_timerange_mode = require("../../helpers/get_timerange_mode");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function dropLastBucketFn(bucket, panel, series) {
  return next => results => {
    const shouldDropLastBucket = (0, _get_timerange_mode.isLastValueTimerangeMode)(panel);

    if (shouldDropLastBucket) {
      const fn = (0, _drop_last_bucket.dropLastBucket)({
        aggregations: bucket
      }, panel, series);
      return fn(next)(results);
    }

    return next(results);
  };
}