"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUrls = void 0;

var _url = require("url");

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * isBogusUrl
 *
 * Besides checking to see if the URL is relative, we also
 * need to verify that window.location.href won't navigate
 * to it, which url.parse doesn't catch all variants of
 */


const isBogusUrl = url => {
  const {
    host,
    protocol,
    port
  } = (0, _url.parse)(url, false, true);
  return host !== null || protocol !== null || port !== null;
};

const validateUrls = urls => {
  const badUrls = (0, _lodash.filter)(urls, url => isBogusUrl(url));

  if (badUrls.length) {
    throw new Error(`Found invalid URL(s), all URLs must be relative: ${badUrls.join(' ')}`);
  }
};

exports.validateUrls = validateUrls;