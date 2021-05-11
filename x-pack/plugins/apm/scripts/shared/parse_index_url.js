"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseIndexUrl = parseIndexUrl;

var _url = require("url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function parseIndexUrl(url) {
  const parsed = (0, _url.parse)(url);
  const {
    pathname,
    ...rest
  } = parsed;
  return {
    node: (0, _url.format)(rest),
    index: pathname.replace('/', '')
  };
}