"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicAggs = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const basicAggs = ['count', 'avg', 'max', 'min', 'sum', 'std_deviation', 'variance', 'sum_of_squares', 'value_count', 'cardinality'];
exports.basicAggs = basicAggs;