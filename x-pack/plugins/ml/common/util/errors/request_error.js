"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MLRequestFailure = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class MLRequestFailure extends Error {
  constructor(error, resp) {
    super(error.message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (typeof resp !== 'string' && typeof resp !== 'undefined') {
      if ('body' in resp) {
        this.stack = JSON.stringify(resp.body, null, 2);
      } else {
        try {
          this.stack = JSON.stringify(resp, null, 2);
        } catch (e) {// fail silently
        }
      }
    }
  }

}

exports.MLRequestFailure = MLRequestFailure;