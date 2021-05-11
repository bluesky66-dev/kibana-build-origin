"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterDateHistogram = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _common = require("../../../../../common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createFilterDateHistogram = (agg, key) => {
  const start = (0, _moment.default)(key);
  const interval = agg.buckets.getInterval();
  return (0, _common.buildRangeFilter)(agg.params.field, {
    gte: start.toISOString(),
    lt: start.add(interval).toISOString(),
    format: 'strict_date_optional_time'
  }, agg.getIndexPattern());
};

exports.createFilterDateHistogram = createFilterDateHistogram;