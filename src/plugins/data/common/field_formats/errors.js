"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldFormatNotFoundError = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class FieldFormatNotFoundError extends Error {
  constructor(message, formatId) {
    super(message);

    _defineProperty(this, "formatId", void 0);

    this.name = 'FieldFormatNotFoundError';
    this.formatId = formatId;
  }

}

exports.FieldFormatNotFoundError = FieldFormatNotFoundError;