"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeShift = timeShift;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function timeShift(resp, panel, series) {
  return next => results => {
    if (/^([+-]?[\d]+)([shmdwMy]|ms)$/.test(series.offset_time)) {
      const matches = series.offset_time.match(/^([+-]?[\d]+)([shmdwMy]|ms)$/);

      if (matches) {
        const offsetValue = matches[1];
        const offsetUnit = matches[2];
        results.forEach(item => {
          if ((0, _lodash.startsWith)(item.id, series.id)) {
            item.data = item.data.map(row => [_moment.default.utc(row[0]).add(offsetValue, offsetUnit).valueOf(), row[1]]);
          }
        });
      }
    }

    return next(results);
  };
}