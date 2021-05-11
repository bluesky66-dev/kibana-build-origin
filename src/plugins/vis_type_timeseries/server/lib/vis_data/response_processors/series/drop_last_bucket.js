"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropLastBucket = dropLastBucket;

var _lodash = require("lodash");

var _get_timerange_mode = require("../../helpers/get_timerange_mode");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function dropLastBucket(resp, panel, series) {
  return next => results => {
    const shouldDropLastBucket = (0, _get_timerange_mode.isLastValueTimerangeMode)(panel, series);

    if (shouldDropLastBucket) {
      const seriesDropLastBucket = (0, _lodash.get)(series, 'override_drop_last_bucket', 1);
      const dropLastBucket = (0, _lodash.get)(panel, 'drop_last_bucket', seriesDropLastBucket);

      if (dropLastBucket) {
        results.forEach(item => {
          item.data = item.data.slice(0, item.data.length - 1);
        });
      }
    }

    return next(results);
  };
}