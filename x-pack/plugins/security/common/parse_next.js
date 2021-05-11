"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseNext = parseNext;

var _url = require("url");

var _constants = require("./constants");

var _is_internal_url = require("./is_internal_url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function parseNext(href, basePath = '') {
  const {
    query,
    hash
  } = (0, _url.parse)(href, true);
  let next = query[_constants.NEXT_URL_QUERY_STRING_PARAMETER];

  if (!next) {
    return `${basePath}/`;
  }

  if (Array.isArray(next) && next.length > 0) {
    next = next[0];
  } else {
    next = next;
  } // validate that `next` is not attempting a redirect to somewhere
  // outside of this Kibana install.


  if (!(0, _is_internal_url.isInternalURL)(next, basePath)) {
    return `${basePath}/`;
  }

  return next + (hash || '');
}