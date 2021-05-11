"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seriesAgg = seriesAgg;

var _series_agg = require("./_series_agg");

var _lodash = _interopRequireDefault(require("lodash"));

var _calculate_label = require("../../../../../common/calculate_label");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function seriesAgg(resp, panel, series, meta, extractFields) {
  return next => async results => {
    if (series.aggregate_by && series.aggregate_function) {
      const targetSeries = []; // Filter out the seires with the matching metric and store them
      // in targetSeries

      results = results.filter(s => {
        if (s.id.split(/:/)[0] === series.id) {
          targetSeries.push(s.data);
          return false;
        }

        return true;
      });
      const fn = _series_agg.SeriesAgg[series.aggregate_function];
      const data = fn(targetSeries);
      const fieldsForMetaIndex = meta.index ? await extractFields(meta.index) : [];
      results.push({
        id: `${series.id}`,
        label: series.label || (0, _calculate_label.calculateLabel)(_lodash.default.last(series.metrics), series.metrics, fieldsForMetaIndex),
        data: _lodash.default.first(data)
      });
    }

    return next(results);
  };
}