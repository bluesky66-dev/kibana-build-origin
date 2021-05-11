"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPercentileValue = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getPercentileValue = (agg, bucket) => {
  const {
    values
  } = bucket[agg.parentId];
  const percentile = (0, _lodash.find)(values, ({
    key
  }) => key === agg.key);
  return percentile ? percentile.value : NaN;
};

exports.getPercentileValue = getPercentileValue;