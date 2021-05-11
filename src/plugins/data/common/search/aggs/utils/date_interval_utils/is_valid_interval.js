"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidInterval = isValidInterval;

var _is_valid_es_interval = require("./is_valid_es_interval");

var _least_common_interval = require("./least_common_interval");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// When base interval is set, check for least common interval and allow
// input the value is the same. This means that the input interval is a
// multiple of the base interval.
function parseWithBase(value, baseInterval) {
  try {
    const interval = (0, _least_common_interval.leastCommonInterval)(baseInterval, value);
    return interval === value.replace(/\s/g, '');
  } catch (e) {
    return false;
  }
}

function isValidInterval(value, baseInterval) {
  if (baseInterval) {
    return parseWithBase(value, baseInterval);
  } else {
    return (0, _is_valid_es_interval.isValidEsInterval)(value);
  }
}