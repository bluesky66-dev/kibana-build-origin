"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTypeDisabledError = void 0;

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


class ActionTypeDisabledError extends Error {
  constructor(message, reason) {
    super(message);

    _defineProperty(this, "reason", void 0);

    this.reason = reason;
  }

  sendResponse(res) {
    return res.forbidden({
      body: {
        message: this.message
      }
    });
  }

}

exports.ActionTypeDisabledError = ActionTypeDisabledError;