"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.positiveRate = positiveRate;

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _get_interval_and_timefield = require("../../get_interval_and_timefield");

var _calculate_agg_root = require("./calculate_agg_root");

var _positive_rate = require("../series/positive_rate");

var _common = require("../../../../../../data/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function positiveRate(req, panel, esQueryConfig, indexPatternObject, capabilities, uiSettings) {
  return next => async doc => {
    const barTargetUiSettings = await uiSettings.get(_common.UI_SETTINGS.HISTOGRAM_BAR_TARGET);
    const {
      interval
    } = (0, _get_interval_and_timefield.getIntervalAndTimefield)(panel, {}, indexPatternObject);
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)(req, interval, capabilities, barTargetUiSettings);
    panel.series.forEach(column => {
      const aggRoot = (0, _calculate_agg_root.calculateAggRoot)(doc, column);
      column.metrics.filter(_positive_rate.filter).forEach((0, _positive_rate.createPositiveRate)(doc, intervalString, aggRoot));
    });
    return next(doc);
  };
}