"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalSearchFindError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// only one type for now, but already present for future-proof reasons

/**
 * Error thrown from the {@link GlobalSearchPluginStart.find | GlobalSearch find API}'s result observable
 *
 * @public
 */

class GlobalSearchFindError extends Error {
  static invalidLicense(message) {
    return new GlobalSearchFindError('invalid-license', message);
  }

  constructor(type, message) {
    super(message); // Set the prototype explicitly, see:
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

    this.type = type;
    Object.setPrototypeOf(this, GlobalSearchFindError.prototype);
  }

}

exports.GlobalSearchFindError = GlobalSearchFindError;