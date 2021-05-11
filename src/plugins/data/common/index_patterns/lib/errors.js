"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexPatternMissingIndices = void 0;

var _common = require("../../../../kibana_utils/common/");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable */

/**
 * Tried to call a method that relies on SearchSource having an indexPattern assigned
 */
class IndexPatternMissingIndices extends _common.KbnError {
  constructor(message) {
    const defaultMessage = "IndexPattern's configured pattern does not match any indices";
    super(message && message.length ? `No matching indices found: ${message}` : defaultMessage);
  }

}

exports.IndexPatternMissingIndices = IndexPatternMissingIndices;