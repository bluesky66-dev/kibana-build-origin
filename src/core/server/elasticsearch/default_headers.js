"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_HEADERS = void 0;

var _std = require("@kbn/std");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_HEADERS = (0, _std.deepFreeze)({
  // Elasticsearch uses this to identify when a request is coming from Kibana, to allow Kibana to
  // access system indices using the standard ES APIs without logging a warning. After migrating to
  // use the new system index APIs, this header can be removed.
  'x-elastic-product-origin': 'kibana'
});
exports.DEFAULT_HEADERS = DEFAULT_HEADERS;