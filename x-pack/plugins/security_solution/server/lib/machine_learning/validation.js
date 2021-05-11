"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwHttpError = exports.toHttpError = exports.HttpAuthzError = void 0;

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


class HttpAuthzError extends Error {
  constructor(message) {
    super(message);

    _defineProperty(this, "statusCode", void 0);

    this.name = 'HttpAuthzError';
    this.statusCode = 403;
  }

}

exports.HttpAuthzError = HttpAuthzError;

const toHttpError = validation => {
  if (!validation.valid) {
    return new HttpAuthzError(validation.message);
  }
};

exports.toHttpError = toHttpError;

const throwHttpError = validation => {
  const error = toHttpError(validation);

  if (error) {
    throw error;
  }
};

exports.throwHttpError = throwHttpError;