"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLastSeriesTimestamp = getLastSeriesTimestamp;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @param {Array} seriesGroup
 * [
 *  [
 *    {
 *      data: [
 *        [1555189200000, 12],
 *        [1555191100000, 42],
 *        [1555263300000, 95],
 *        ...coordinates,
 *      ]
 *      ...properties,
 *    }
 *    ...series,
 *  ]
 *  ...seriesGroups,
 * ]
 * @return {number} lastTimestamp
 */
function getLastSeriesTimestamp(seriesGroup = []) {
  let lastTimestamp = null;
  seriesGroup.forEach(series => {
    series.forEach(({
      data
    }) => {
      const [dataLastTimestamp] = (0, _lodash.last)(data);
      lastTimestamp = Math.max(lastTimestamp, dataLastTimestamp);
    });
  });
  return lastTimestamp;
}