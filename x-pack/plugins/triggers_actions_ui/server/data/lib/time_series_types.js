"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateDuration = validateDuration;
Object.defineProperty(exports, "TimeSeriesResult", {
  enumerable: true,
  get: function () {
    return _data.TimeSeriesResult;
  }
});
Object.defineProperty(exports, "TimeSeriesResultRow", {
  enumerable: true,
  get: function () {
    return _data.TimeSeriesResultRow;
  }
});
Object.defineProperty(exports, "MetricResult", {
  enumerable: true,
  get: function () {
    return _data.MetricResult;
  }
});
exports.TimeSeriesQuerySchema = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../alerts/server");

var _index = require("../index");

var _core_query_types = require("./core_query_types");

var _date_range_info = require("./date_range_info");

var _data = require("../../../common/data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// The parameters and response for the `timeSeriesQuery()` service function,
// and associated HTTP endpoint.


const TimeSeriesQuerySchema = _configSchema.schema.object({ ..._core_query_types.CoreQueryParamsSchemaProperties,
  // start of the date range to search, as an iso string; defaults to dateEnd
  dateStart: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateDate
  })),
  // end of the date range to search, as an iso string; defaults to now
  dateEnd: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateDate
  })),
  // intended to be set to the `interval` property of the alert itself,
  // this value indicates the amount of time between time series dates
  // that will be calculated.
  interval: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateDuration
  }))
}, {
  validate: validateBody
}); // using direct type not allowed, circular reference, so body is typed to unknown


exports.TimeSeriesQuerySchema = TimeSeriesQuerySchema;

function validateBody(anyParams) {
  // validate core query parts, return if it fails validation (returning string)
  const coreQueryValidated = (0, _core_query_types.validateCoreQueryBody)(anyParams);
  if (coreQueryValidated) return coreQueryValidated;
  const {
    dateStart,
    dateEnd,
    interval
  } = anyParams; // dates already validated in validateDate(), if provided

  const epochStart = dateStart ? Date.parse(dateStart) : undefined;
  const epochEnd = dateEnd ? Date.parse(dateEnd) : undefined;

  if (epochStart && epochEnd) {
    if (epochStart > epochEnd) {
      return (0, _date_range_info.getDateStartAfterDateEndErrorMessage)();
    }

    if (epochStart !== epochEnd && !interval) {
      return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.intervalRequiredErrorMessage', {
        defaultMessage: '[interval]: must be specified if [dateStart] does not equal [dateEnd]'
      });
    }

    if (interval) {
      const intervalMillis = (0, _server.parseDuration)(interval);
      const intervals = Math.round((epochEnd - epochStart) / intervalMillis);

      if (intervals > _index.MAX_INTERVALS) {
        return (0, _date_range_info.getTooManyIntervalsErrorMessage)(intervals, _index.MAX_INTERVALS);
      }
    }
  }
}

function validateDate(dateString) {
  const parsed = Date.parse(dateString);

  if (isNaN(parsed)) {
    return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.invalidDateErrorMessage', {
      defaultMessage: 'invalid date {date}',
      values: {
        date: dateString
      }
    });
  }
}

function validateDuration(duration) {
  try {
    (0, _server.parseDuration)(duration);
  } catch (err) {
    return _i18n.i18n.translate('xpack.triggersActionsUI.data.coreQueryParams.invalidDurationErrorMessage', {
      defaultMessage: 'invalid duration: "{duration}"',
      values: {
        duration
      }
    });
  }
}