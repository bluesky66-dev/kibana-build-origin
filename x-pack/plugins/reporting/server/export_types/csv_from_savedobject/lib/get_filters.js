"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilters = getFilters;

var _boom = require("@hapi/boom");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getFilters(indexPatternId, indexPatternTimeField, timerange, savedSearchObjectAttr, searchSourceFilter, queryFilter) {
  let includes;
  let timeFilter;
  let timezone;

  if (indexPatternTimeField) {
    if (!timerange || timerange.min == null || timerange.max == null) {
      throw (0, _boom.badRequest)(`Time range params are required for index pattern [${indexPatternId}], using time field [${indexPatternTimeField}]`);
    }

    timezone = timerange.timezone;
    const {
      min: gte,
      max: lte
    } = timerange;
    timeFilter = {
      range: {
        [indexPatternTimeField]: {
          format: 'strict_date_time',
          gte: _momentTimezone.default.tz((0, _momentTimezone.default)(gte), timezone).format(),
          lte: _momentTimezone.default.tz((0, _momentTimezone.default)(lte), timezone).format()
        }
      }
    };
    const savedSearchCols = savedSearchObjectAttr.columns || [];
    includes = [indexPatternTimeField, ...savedSearchCols];
  } else {
    includes = savedSearchObjectAttr.columns || [];
    timeFilter = null;
    timezone = null;
  }

  const combinedFilter = [timeFilter, searchSourceFilter, queryFilter].filter(Boolean); // builds an array of defined filters

  return {
    timezone,
    combinedFilter,
    includes
  };
}