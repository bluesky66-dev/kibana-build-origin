"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReasonFromError = getReasonFromError;
exports.isErrorWithReason = isErrorWithReason;
exports.ErrorWithReason = void 0;

var _types = require("../types");

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

class ErrorWithReason extends Error {
  constructor(reason, error) {
    super(error.message);

    _defineProperty(this, "reason", void 0);

    _defineProperty(this, "error", void 0);

    this.error = error;
    this.reason = reason;
  }

}

exports.ErrorWithReason = ErrorWithReason;

function getReasonFromError(error) {
  if (isErrorWithReason(error)) {
    return error.reason;
  }

  return _types.AlertExecutionStatusErrorReasons.Unknown;
}

function isErrorWithReason(error) {
  return error instanceof ErrorWithReason;
}