"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorIndexPatternFieldNotFound = exports.ErrorIndexPatternNotFound = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
class ErrorIndexPatternNotFound extends Error {
  constructor(message) {
    super(message);

    _defineProperty(this, "is404", true);

    Object.setPrototypeOf(this, ErrorIndexPatternNotFound.prototype);
  }

}

exports.ErrorIndexPatternNotFound = ErrorIndexPatternNotFound;

class ErrorIndexPatternFieldNotFound extends ErrorIndexPatternNotFound {
  constructor(indexPatternId, fieldName) {
    super(`Field [index_pattern = ${indexPatternId}, field = ${fieldName}] not found.`);
  }

}

exports.ErrorIndexPatternFieldNotFound = ErrorIndexPatternFieldNotFound;