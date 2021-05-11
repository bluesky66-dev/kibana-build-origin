"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateHistogram = dateHistogram;

var _helpers = require("../../helpers");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _offset_time = require("../../offset_time");

var _get_interval_and_timefield = require("../../get_interval_and_timefield");

var _get_timerange_mode = require("../../helpers/get_timerange_mode");

var _server = require("../../../../../../../plugins/data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  dateHistogramInterval
} = _server.search.aggs;

function dateHistogram(req, panel, series, esQueryConfig, indexPatternObject, capabilities, uiSettings) {
  return next => async doc => {
    const maxBarsUiSettings = await uiSettings.get(_server.UI_SETTINGS.HISTOGRAM_MAX_BARS);
    const barTargetUiSettings = await uiSettings.get(_server.UI_SETTINGS.HISTOGRAM_BAR_TARGET);
    const {
      timeField,
      interval,
      maxBars
    } = (0, _get_interval_and_timefield.getIntervalAndTimefield)(panel, series, indexPatternObject);
    const {
      bucketSize,
      intervalString
    } = (0, _get_bucket_size.getBucketSize)(req, interval, capabilities, maxBars ? Math.min(maxBarsUiSettings, maxBars) : barTargetUiSettings);

    const getDateHistogramForLastBucketMode = () => {
      const {
        from,
        to
      } = (0, _offset_time.offsetTime)(req, series.offset_time);
      const timezone = capabilities.searchTimezone;
      (0, _helpers.overwrite)(doc, `aggs.${series.id}.aggs.timeseries.date_histogram`, {
        field: timeField,
        min_doc_count: 0,
        time_zone: timezone,
        extended_bounds: {
          min: from.valueOf(),
          max: to.valueOf()
        },
        ...dateHistogramInterval(intervalString)
      });
    };

    const getDateHistogramForEntireTimerangeMode = () => (0, _helpers.overwrite)(doc, `aggs.${series.id}.aggs.timeseries.auto_date_histogram`, {
      field: timeField,
      buckets: 1
    });

    (0, _get_timerange_mode.isLastValueTimerangeMode)(panel, series) ? getDateHistogramForLastBucketMode() : getDateHistogramForEntireTimerangeMode();
    (0, _helpers.overwrite)(doc, `aggs.${series.id}.meta`, {
      timeField,
      intervalString,
      index: indexPatternObject === null || indexPatternObject === void 0 ? void 0 : indexPatternObject.title,
      bucketSize,
      seriesId: series.id
    });
    return next(doc);
  };
}