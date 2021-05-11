"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorWithStatusCode = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ErrorWithStatusCode extends Error {
  constructor(message, statusCode) {
    super(message);

    _defineProperty(this, "statusCode", void 0);

    _defineProperty(this, "getStatusCode", () => this.statusCode);

    this.statusCode = statusCode;
  }

}

exports.ErrorWithStatusCode = ErrorWithStatusCode;