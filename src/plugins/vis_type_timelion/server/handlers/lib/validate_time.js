"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateTime;

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _to_milliseconds = require("../../../common/lib/to_milliseconds");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function validateTime(time, tlConfig) {
  const span = _moment.default.duration((0, _moment.default)(time.to).diff((0, _moment.default)(time.from))).asMilliseconds();

  const interval = (0, _to_milliseconds.toMS)(time.interval);
  const bucketCount = span / interval;
  const maxBuckets = tlConfig.settings['timelion:max_buckets'];

  if (bucketCount > maxBuckets) {
    throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.bucketsOverflowErrorMessage', {
      defaultMessage: 'Max buckets exceeded: {bucketCount} of {maxBuckets} allowed. ' + 'Choose a larger interval or a shorter time span',
      values: {
        bucketCount: Math.round(bucketCount),
        maxBuckets
      }
    }));
  }

  return true;
}

module.exports = exports.default;