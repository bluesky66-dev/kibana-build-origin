"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeRequestVersion = decodeRequestVersion;

var _decode_version = require("./decode_version");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Helper for decoding version to request params that are driven
 * by the version info
 */
function decodeRequestVersion(version) {
  const decoded = (0, _decode_version.decodeVersion)(version);
  return {
    if_seq_no: decoded._seq_no,
    if_primary_term: decoded._primary_term
  };
}