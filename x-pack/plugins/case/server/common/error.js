"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCaseError = isCaseError;
exports.createCaseError = createCaseError;

var _boom = require("@hapi/boom");

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
/**
 * Helper class for wrapping errors while preserving the original thrown error.
 */


class CaseError extends Error {
  constructor(message, originalError) {
    super(message);

    _defineProperty(this, "wrappedError", void 0);

    this.name = this.constructor.name; // for stack traces

    if (isCaseError(originalError)) {
      this.wrappedError = originalError.wrappedError;
    } else {
      this.wrappedError = originalError;
    }
  }
  /**
   * This function creates a boom representation of the error. If the wrapped error is a boom we'll grab the statusCode
   * and data from that.
   */


  boomify() {
    var _this$message, _this$wrappedError;

    const message = (_this$message = this.message) !== null && _this$message !== void 0 ? _this$message : (_this$wrappedError = this.wrappedError) === null || _this$wrappedError === void 0 ? void 0 : _this$wrappedError.message;
    let statusCode = 500;
    let data;

    if ((0, _boom.isBoom)(this.wrappedError)) {
      var _this$wrappedError2, _this$wrappedError$ou, _this$wrappedError3, _this$wrappedError3$o;

      data = (_this$wrappedError2 = this.wrappedError) === null || _this$wrappedError2 === void 0 ? void 0 : _this$wrappedError2.data;
      statusCode = (_this$wrappedError$ou = (_this$wrappedError3 = this.wrappedError) === null || _this$wrappedError3 === void 0 ? void 0 : (_this$wrappedError3$o = _this$wrappedError3.output) === null || _this$wrappedError3$o === void 0 ? void 0 : _this$wrappedError3$o.statusCode) !== null && _this$wrappedError$ou !== void 0 ? _this$wrappedError$ou : 500;
    }

    return new _boom.Boom(message, {
      data,
      statusCode
    });
  }

}
/**
 * Type guard for determining if an error is a CaseError
 */


function isCaseError(error) {
  return error instanceof CaseError;
}
/**
 * Create a CaseError that wraps the original thrown error. This also logs the message that will be placed in the CaseError
 * if the logger was defined.
 */


function createCaseError({
  message,
  error,
  logger
}) {
  const logMessage = message !== null && message !== void 0 ? message : error === null || error === void 0 ? void 0 : error.toString();

  if (logMessage !== undefined) {
    logger === null || logger === void 0 ? void 0 : logger.error(logMessage);
  }

  return new CaseError(message, error);
}