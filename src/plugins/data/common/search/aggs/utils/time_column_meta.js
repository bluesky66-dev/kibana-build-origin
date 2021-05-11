"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateMetaByDatatableColumn = void 0;

var _buckets = require("../buckets");

var _infer_time_zone = require("./infer_time_zone");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getDateMetaByDatatableColumn = ({
  calculateAutoTimeExpression,
  getIndexPattern,
  isDefaultTimezone,
  getConfig
}) => async (column) => {
  var _column$meta$sourcePa;

  if (column.meta.source !== 'esaggs') return;
  if (((_column$meta$sourcePa = column.meta.sourceParams) === null || _column$meta$sourcePa === void 0 ? void 0 : _column$meta$sourcePa.type) !== _buckets.BUCKET_TYPES.DATE_HISTOGRAM) return;
  const params = column.meta.sourceParams.params;
  const appliedTimeRange = column.meta.sourceParams.appliedTimeRange;
  const tz = (0, _infer_time_zone.inferTimeZone)(params, await getIndexPattern(column.meta.sourceParams.indexPatternId), isDefaultTimezone, getConfig);
  const interval = params.interval === 'auto' && appliedTimeRange ? calculateAutoTimeExpression(appliedTimeRange) : params.interval;

  if (!interval || interval === 'auto') {
    throw new Error('time interval could not be determined');
  }

  return {
    timeZone: tz,
    timeRange: appliedTimeRange,
    interval
  };
};

exports.getDateMetaByDatatableColumn = getDateMetaByDatatableColumn;