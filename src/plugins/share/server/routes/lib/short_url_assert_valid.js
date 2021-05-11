"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shortUrlAssertValid = shortUrlAssertValid;

var _url = require("url");

var _lodash = require("lodash");

var _boom = _interopRequireDefault(require("@hapi/boom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function shortUrlAssertValid(url) {
  const {
    protocol,
    hostname,
    pathname
  } = (0, _url.parse)(url, false
  /* parseQueryString */
  , true
  /* slashesDenoteHost */
  );

  if (protocol !== null) {
    throw _boom.default.notAcceptable(`Short url targets cannot have a protocol, found "${protocol}"`);
  }

  if (hostname !== null) {
    throw _boom.default.notAcceptable(`Short url targets cannot have a hostname, found "${hostname}"`);
  }

  const pathnameParts = (0, _lodash.trim)(pathname === null ? undefined : pathname, '/').split('/');

  if (pathnameParts.length !== 2 || pathnameParts[0] !== 'app' || !pathnameParts[1]) {
    throw _boom.default.notAcceptable(`Short url target path must be in the format "/app/{{appId}}", found "${pathname}"`);
  }
}