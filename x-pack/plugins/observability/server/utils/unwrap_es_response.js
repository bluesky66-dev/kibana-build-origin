"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unwrapEsResponse = unwrapEsResponse;
exports.WrappedElasticsearchClientError = void 0;

var _errors = require("@elastic/elasticsearch/lib/errors");

var _util = require("util");

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

class WrappedElasticsearchClientError extends Error {
  constructor(originalError) {
    super(originalError.message);

    _defineProperty(this, "originalError", void 0);

    const stack = this.stack;
    this.originalError = originalError;

    if (originalError instanceof _errors.ResponseError) {
      // make sure ES response body is visible when logged to the console
      // @ts-expect-error
      this.stack = {
        valueOf() {
          var _stack$valueOf;

          const value = (_stack$valueOf = stack === null || stack === void 0 ? void 0 : stack.valueOf()) !== null && _stack$valueOf !== void 0 ? _stack$valueOf : '';
          return value;
        },

        toString() {
          const value = (stack === null || stack === void 0 ? void 0 : stack.toString()) + `\nResponse: ${(0, _util.inspect)(originalError.meta.body, {
            depth: null
          })}\n`;
          return value;
        }

      };
    }
  }

}

exports.WrappedElasticsearchClientError = WrappedElasticsearchClientError;

function unwrapEsResponse(responsePromise) {
  return responsePromise.then(res => res.body).catch(err => {
    // make sure stacktrace is relative to where client was called
    throw new WrappedElasticsearchClientError(err);
  });
}