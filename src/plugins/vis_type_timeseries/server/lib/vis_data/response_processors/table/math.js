"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.math = math;

var _math = require("../series/math");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function math(bucket, panel, series) {
  return next => results => {
    const mathFn = (0, _math.mathAgg)({
      aggregations: bucket
    }, panel, series);
    return mathFn(next)(results);
  };
}