"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeVersion = encodeVersion;

var _base = require("./base64");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Encode the sequence params into an "opaque" version string
 * that can be used in the saved object API in place of numeric
 * version numbers
 */
function encodeVersion(seqNo, primaryTerm) {
  if (!Number.isInteger(primaryTerm)) {
    throw new TypeError('_primary_term from elasticsearch must be an integer');
  }

  if (!Number.isInteger(seqNo)) {
    throw new TypeError('_seq_no from elasticsearch must be an integer');
  }

  return (0, _base.encodeBase64)(JSON.stringify([seqNo, primaryTerm]));
}