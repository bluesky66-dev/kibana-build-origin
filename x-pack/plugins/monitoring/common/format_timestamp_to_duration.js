"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTimestampToDuration = formatTimestampToDuration;

var _moment = _interopRequireDefault(require("moment"));

require("moment-duration-format");

var _constants = require("./constants");

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

/*
 * Formats a timestamp string
 * @param timestamp: ISO time string
 * @param calculationFlag: control "since" or "until" logic
 * @param initialTime {Object} moment object (not required)
 * @return string
 */


function formatTimestampToDuration(timestamp, calculationFlag, initialTime) {
  initialTime = initialTime || (0, _moment.default)();
  let timeDuration;

  if (calculationFlag === _constants.CALCULATE_DURATION_SINCE) {
    timeDuration = _moment.default.duration(initialTime - (0, _moment.default)(timestamp)); // since: now - timestamp
  } else if (calculationFlag === _constants.CALCULATE_DURATION_UNTIL) {
    timeDuration = _moment.default.duration((0, _moment.default)(timestamp) - initialTime); // until: timestamp - now
  } else {
    throw new Error('[formatTimestampToDuration] requires a [calculationFlag] parameter to specify format as "since" or "until" the given time.');
  } // See https://github.com/elastic/x-pack-kibana/issues/3554


  let duration;

  if (Math.abs(initialTime.diff(timestamp, 'months')) >= 1) {
    // time diff is greater than 1 month, show months / days
    duration = _moment.default.duration(timeDuration).format(_constants.FORMAT_DURATION_TEMPLATE_LONG);
  } else if (Math.abs(initialTime.diff(timestamp, 'minutes')) >= 1) {
    // time diff is less than 1 month but greater than a minute, show days / hours / minutes
    duration = _moment.default.duration(timeDuration).format(_constants.FORMAT_DURATION_TEMPLATE_SHORT);
  } else {
    // time diff is less than a minute, show seconds
    duration = _moment.default.duration(timeDuration).format(_constants.FORMAT_DURATION_TEMPLATE_TINY);
  }

  return duration.replace(/ -?0 mins$/, '').replace(/ -?0 hrs$/, '').replace(/ -?0 days$/, ''); // See https://github.com/jsmreese/moment-duration-format/issues/64
}