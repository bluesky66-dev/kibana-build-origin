"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CREATE_PATH = exports.getUrlPath = exports.GETTER_PREFIX = exports.getGotoPath = exports.getUrlIdFromGotoRoute = exports.GOTO_PREFIX = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const GOTO_PREFIX = '/goto';
exports.GOTO_PREFIX = GOTO_PREFIX;

const getUrlIdFromGotoRoute = path => {
  var _path$match;

  return (_path$match = path.match(new RegExp(`${GOTO_PREFIX}/(.*)$`))) === null || _path$match === void 0 ? void 0 : _path$match[1];
};

exports.getUrlIdFromGotoRoute = getUrlIdFromGotoRoute;

const getGotoPath = urlId => `${GOTO_PREFIX}/${urlId}`;

exports.getGotoPath = getGotoPath;
const GETTER_PREFIX = '/api/short_url';
exports.GETTER_PREFIX = GETTER_PREFIX;

const getUrlPath = urlId => `${GETTER_PREFIX}/${urlId}`;

exports.getUrlPath = getUrlPath;
const CREATE_PATH = '/api/shorten_url';
exports.CREATE_PATH = CREATE_PATH;