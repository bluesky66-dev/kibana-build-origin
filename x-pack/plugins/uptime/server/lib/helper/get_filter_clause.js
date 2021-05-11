"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterClause = void 0;

var _make_date_rate_filter = require("./make_date_rate_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFilterClause = (dateRangeStart, dateRangeEnd, additionalKeys) => additionalKeys && additionalKeys.length > 0 ? [(0, _make_date_rate_filter.makeDateRangeFilter)(dateRangeStart, dateRangeEnd), ...additionalKeys] : [(0, _make_date_rate_filter.makeDateRangeFilter)(dateRangeStart, dateRangeEnd)];

exports.getFilterClause = getFilterClause;