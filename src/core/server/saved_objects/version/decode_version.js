"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeVersion = decodeVersion;

var _errors = require("../service/lib/errors");

var _base = require("./base64");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Decode the "opaque" version string to the sequence params we
 * can use to activate optimistic concurrency in Elasticsearch
 */
function decodeVersion(version) {
  try {
    if (typeof version !== 'string') {
      throw new TypeError();
    }

    const seqParams = JSON.parse((0, _base.decodeBase64)(version));

    if (!Array.isArray(seqParams) || seqParams.length !== 2 || !Number.isInteger(seqParams[0]) || !Number.isInteger(seqParams[1])) {
      throw new TypeError();
    }

    return {
      _seq_no: seqParams[0],
      _primary_term: seqParams[1]
    };
  } catch (_) {
    throw _errors.SavedObjectsErrorHelpers.createInvalidVersionError(version);
  }
}