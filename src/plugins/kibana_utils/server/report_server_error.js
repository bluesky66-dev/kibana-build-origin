"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKbnServerError = getKbnServerError;
exports.reportServerError = reportServerError;
exports.KbnServerError = void 0;

var _errors = require("@elastic/elasticsearch/lib/errors");

var _common = require("../common");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class KbnServerError extends _common.KbnError {
  constructor(message, statusCode, errBody) {
    super(message);
    this.statusCode = statusCode;

    _defineProperty(this, "errBody", void 0);

    this.errBody = errBody;
  }

}
/**
 * Formats any error thrown into a standardized `KbnServerError`.
 * @param e `Error` or `ElasticsearchClientError`
 * @returns `KbnServerError`
 */


exports.KbnServerError = KbnServerError;

function getKbnServerError(e) {
  var _e$message;

  return new KbnServerError((_e$message = e.message) !== null && _e$message !== void 0 ? _e$message : 'Unknown error', e instanceof _errors.ResponseError ? e.statusCode : 500, e instanceof _errors.ResponseError ? e.body : undefined);
}
/**
 *
 * @param res Formats a `KbnServerError` into a server error response
 * @param err
 */


function reportServerError(res, err) {
  var _err$statusCode, _err$errBody;

  return res.customError({
    statusCode: (_err$statusCode = err.statusCode) !== null && _err$statusCode !== void 0 ? _err$statusCode : 500,
    body: {
      message: err.message,
      attributes: (_err$errBody = err.errBody) === null || _err$errBody === void 0 ? void 0 : _err$errBody.error
    }
  });
}