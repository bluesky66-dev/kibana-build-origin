"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertDateRangeToString = convertDateRangeToString;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function convertDateRangeToString({
  from,
  to
}, format) {
  if (!from) {
    return 'Before ' + format(to);
  } else if (!to) {
    return 'After ' + format(from);
  } else {
    return format(from) + ' to ' + format(to);
  }
}