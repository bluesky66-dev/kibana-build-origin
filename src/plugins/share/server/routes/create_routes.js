"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoutes = createRoutes;

var _short_url_lookup = require("./lib/short_url_lookup");

var _goto = require("./goto");

var _shorten_url = require("./shorten_url");

var _get = require("./get");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createRoutes({
  http
}, logger) {
  const shortUrlLookup = (0, _short_url_lookup.shortUrlLookupProvider)({
    logger
  });
  const router = http.createRouter();
  (0, _goto.createGotoRoute)({
    router,
    shortUrlLookup,
    http
  });
  (0, _get.createGetterRoute)({
    router,
    shortUrlLookup,
    http
  });
  (0, _shorten_url.createShortenUrlRoute)({
    router,
    shortUrlLookup
  });
}