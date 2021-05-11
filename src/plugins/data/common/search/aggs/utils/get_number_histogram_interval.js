"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumberHistogramIntervalByDatatableColumn = void 0;

var _bucket_agg_types = require("../buckets/bucket_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Helper function returning the used interval for data table column created by the histogramm agg type.
 * "auto" will get expanded to the actually used interval.
 * If the column is not a column created by a histogram aggregation of the esaggs data source,
 * this function will return undefined.
 */
const getNumberHistogramIntervalByDatatableColumn = column => {
  var _column$meta$sourcePa;

  if (column.meta.source !== 'esaggs') return;
  if (((_column$meta$sourcePa = column.meta.sourceParams) === null || _column$meta$sourcePa === void 0 ? void 0 : _column$meta$sourcePa.type) !== _bucket_agg_types.BUCKET_TYPES.HISTOGRAM) return;
  const params = column.meta.sourceParams.params;

  if (!params.used_interval || typeof params.used_interval === 'string') {
    return undefined;
  }

  return params.used_interval;
};

exports.getNumberHistogramIntervalByDatatableColumn = getNumberHistogramIntervalByDatatableColumn;