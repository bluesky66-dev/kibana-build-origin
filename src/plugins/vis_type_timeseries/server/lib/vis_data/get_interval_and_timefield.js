"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIntervalAndTimefield = getIntervalAndTimefield;

var _constants = require("../../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_TIME_FIELD = '@timestamp';

function getIntervalAndTimefield(panel, series = {}, indexPatternObject) {
  const getDefaultTimeField = () => {
    var _indexPatternObject$t;

    return (_indexPatternObject$t = indexPatternObject === null || indexPatternObject === void 0 ? void 0 : indexPatternObject.timeFieldName) !== null && _indexPatternObject$t !== void 0 ? _indexPatternObject$t : DEFAULT_TIME_FIELD;
  };

  const timeField = series.override_index_pattern && series.series_time_field || panel.time_field || getDefaultTimeField();
  let interval = panel.interval;
  let maxBars = panel.max_bars;

  if (series.override_index_pattern) {
    interval = series.series_interval;
    maxBars = series.series_max_bars;
  }

  return {
    timeField,
    interval: interval || _constants.AUTO_INTERVAL,
    maxBars
  };
}