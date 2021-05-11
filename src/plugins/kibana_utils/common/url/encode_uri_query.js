"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeUriQuery = encodeUriQuery;
exports.addQueryParam = exports.encodeQuery = void 0;

var _queryString = require("query-string");

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 */
function encodeUriQuery(val, pctEncodeSpaces = false) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
}

const encodeQuery = (query, encodeFunction = encodeUriQuery, pctEncodeSpaces = true) => (0, _lodash.transform)(query, (result, value, key) => {
  if (key) {
    const singleValue = Array.isArray(value) ? value.join(',') : value;
    result[key] = encodeFunction(singleValue === undefined || singleValue === null ? '' : singleValue, pctEncodeSpaces);
  }
});
/**
 * Method to help modify url query params.
 *
 * @param params
 * @param key
 * @param value
 */


exports.encodeQuery = encodeQuery;

const addQueryParam = (params, key, value) => {
  const queryParams = (0, _queryString.parse)(params);

  if (value !== undefined) {
    queryParams[key] = value;
  } else {
    delete queryParams[key];
  }

  return (0, _queryString.stringify)(encodeQuery(queryParams, undefined, false), {
    sort: false,
    encode: false
  });
};

exports.addQueryParam = addQueryParam;