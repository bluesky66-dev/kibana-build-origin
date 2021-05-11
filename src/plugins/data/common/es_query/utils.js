"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeZoneFromSettings = getTimeZoneFromSettings;

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getTimeZoneFromSettings(dateFormatTZ) {
  const detectedTimezone = _momentTimezone.default.tz.guess();

  return dateFormatTZ === 'Browser' ? detectedTimezone : dateFormatTZ;
}