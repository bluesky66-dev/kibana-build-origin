"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEsQueryString = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isEsQueryString = query => (0, _lodash.has)(query, 'query_string.query');

exports.isEsQueryString = isEsQueryString;