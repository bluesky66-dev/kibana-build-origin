"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inferTimeZone = inferTimeZone;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function inferTimeZone(params, indexPattern, isDefaultTimezone, getConfig) {
  let tz = params.time_zone;

  if (!tz && params.field) {
    var _indexPattern$typeMet, _indexPattern$typeMet2, _indexPattern$typeMet3, _indexPattern$typeMet4;

    // If a field has been configured check the index pattern's typeMeta if a date_histogram on that
    // field requires a specific time_zone
    const fieldName = typeof params.field === 'string' ? params.field : params.field.name;
    tz = (_indexPattern$typeMet = indexPattern.typeMeta) === null || _indexPattern$typeMet === void 0 ? void 0 : (_indexPattern$typeMet2 = _indexPattern$typeMet.aggs) === null || _indexPattern$typeMet2 === void 0 ? void 0 : (_indexPattern$typeMet3 = _indexPattern$typeMet2.date_histogram) === null || _indexPattern$typeMet3 === void 0 ? void 0 : (_indexPattern$typeMet4 = _indexPattern$typeMet3[fieldName]) === null || _indexPattern$typeMet4 === void 0 ? void 0 : _indexPattern$typeMet4.time_zone;
  }

  if (!tz) {
    // If the index pattern typeMeta data, didn't had a time zone assigned for the selected field use the configured tz
    const detectedTimezone = _moment.default.tz.guess();

    const tzOffset = (0, _moment.default)().format('Z');
    tz = isDefaultTimezone() ? detectedTimezone || tzOffset : // if timezone is not the default, this will always return a string
    getConfig('dateFormat:tz');
  }

  return tz;
}