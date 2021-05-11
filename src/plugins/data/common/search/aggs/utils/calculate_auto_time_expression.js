"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCalculateAutoTimeExpression = getCalculateAutoTimeExpression;

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../../common/constants");

var _time_buckets = require("../buckets/lib/time_buckets");

var _date_interval_utils = require("./date_interval_utils");

var _interval_options = require("../buckets/_interval_options");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getCalculateAutoTimeExpression(getConfig) {
  return function calculateAutoTimeExpression(range) {
    const dates = (0, _date_interval_utils.toAbsoluteDates)(range);

    if (!dates) {
      return;
    }

    const buckets = new _time_buckets.TimeBuckets({
      'histogram:maxBars': getConfig(_constants.UI_SETTINGS.HISTOGRAM_MAX_BARS),
      'histogram:barTarget': getConfig(_constants.UI_SETTINGS.HISTOGRAM_BAR_TARGET),
      dateFormat: getConfig('dateFormat'),
      'dateFormat:scaled': getConfig('dateFormat:scaled')
    });
    buckets.setInterval(_interval_options.autoInterval);
    buckets.setBounds({
      min: (0, _moment.default)(dates.from),
      max: (0, _moment.default)(dates.to)
    });
    return buckets.getInterval().expression;
  };
}