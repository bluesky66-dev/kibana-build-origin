"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIME_RANGE_MODE_KEY = exports.TIME_RANGE_DATA_MODES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Time Range data modes.
 * @constant
 * @public
 */
let TIME_RANGE_DATA_MODES;
/**
 * Key for getting the Time Range mode from the Panel configuration object.
 * @constant
 * @public
 */

exports.TIME_RANGE_DATA_MODES = TIME_RANGE_DATA_MODES;

(function (TIME_RANGE_DATA_MODES) {
  TIME_RANGE_DATA_MODES["ENTIRE_TIME_RANGE"] = "entire_time_range";
  TIME_RANGE_DATA_MODES["LAST_VALUE"] = "last_value";
})(TIME_RANGE_DATA_MODES || (exports.TIME_RANGE_DATA_MODES = TIME_RANGE_DATA_MODES = {}));

const TIME_RANGE_MODE_KEY = 'time_range_mode';
exports.TIME_RANGE_MODE_KEY = TIME_RANGE_MODE_KEY;