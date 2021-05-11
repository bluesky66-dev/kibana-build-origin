"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "calculateInterval", {
  enumerable: true,
  get: function () {
    return _calculate_interval.calculateInterval;
  }
});
Object.defineProperty(exports, "toMS", {
  enumerable: true,
  get: function () {
    return _to_milliseconds.toMS;
  }
});
exports.DEFAULT_TIME_FORMAT = void 0;

var _calculate_interval = require("./calculate_interval");

var _to_milliseconds = require("./to_milliseconds");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_TIME_FORMAT = 'MMMM Do YYYY, HH:mm:ss.SSS';
exports.DEFAULT_TIME_FORMAT = DEFAULT_TIME_FORMAT;