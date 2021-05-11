"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeHitVersion = encodeHitVersion;

var _encode_version = require("./encode_version");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Helper for encoding a version from a "hit" (hits.hits[#] from _search) or
 * "doc" (body from GET, update, etc) object
 */
function encodeHitVersion(response) {
  return (0, _encode_version.encodeVersion)(response._seq_no, response._primary_term);
}