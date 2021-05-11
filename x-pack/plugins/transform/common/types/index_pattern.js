"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIndexPattern = isIndexPattern;

var _object_utils = require("../utils/object_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Custom minimal type guard for IndexPattern to check against the attributes used in transforms code.


function isIndexPattern(arg) {
  return (0, _object_utils.isPopulatedObject)(arg) && 'getComputedFields' in arg && typeof arg.getComputedFields === 'function' && {}.hasOwnProperty.call(arg, 'title') && typeof arg.title === 'string' && {}.hasOwnProperty.call(arg, 'fields') && Array.isArray(arg.fields);
}