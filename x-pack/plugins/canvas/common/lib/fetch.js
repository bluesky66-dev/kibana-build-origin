"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayBufferFetch = exports.fetch = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _constants = require("./constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fetch = _axios.default.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'kbn-xsrf': 'professionally-crafted-string-of-text'
  },
  timeout: _constants.FETCH_TIMEOUT
});

exports.fetch = fetch;

const arrayBufferFetch = _axios.default.create({
  responseType: 'arraybuffer',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'kbn-xsrf': 'professionally-crafted-string-of-text'
  },
  timeout: _constants.FETCH_TIMEOUT
});

exports.arrayBufferFetch = arrayBufferFetch;