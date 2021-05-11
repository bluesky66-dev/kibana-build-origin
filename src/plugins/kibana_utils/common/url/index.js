"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.url = void 0;

var _encode_uri_query = require("./encode_uri_query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const url = {
  encodeQuery: _encode_uri_query.encodeQuery,
  encodeUriQuery: _encode_uri_query.encodeUriQuery,
  addQueryParam: _encode_uri_query.addQueryParam
};
exports.url = url;