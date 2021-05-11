"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtractError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ExtractError extends Error {
  constructor(cause, message = 'Failed to extract the browser archive') {
    super(message);
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.cause = cause;
  }

}

exports.ExtractError = ExtractError;