"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegacyElasticsearchErrorHelpers = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const code = Symbol('ElasticsearchError');
var ErrorCode;
/**
 * @deprecated. The new elasticsearch client doesn't wrap errors anymore.
 * @public
 * */

(function (ErrorCode) {
  ErrorCode["NOT_AUTHORIZED"] = "Elasticsearch/notAuthorized";
})(ErrorCode || (ErrorCode = {}));

function isElasticsearchError(error) {
  return Boolean(error && error[code]);
}

function decorate(error, errorCode, statusCode, message) {
  if (isElasticsearchError(error)) {
    return error;
  }

  const boom = _boom.default.boomify(error, {
    statusCode,
    message,
    // keep status and messages if Boom error object already has them
    override: false
  });

  boom[code] = errorCode;
  return boom;
}
/**
 * Helpers for working with errors returned from the Elasticsearch service.Since the internal data of
 * errors are subject to change, consumers of the Elasticsearch service should always use these helpers
 * to classify errors instead of checking error internals such as `body.error.header[WWW-Authenticate]`
 * @public
 *
 * @example
 * Handle errors
 * ```js
 * try {
 *   await client.asScoped(request).callAsCurrentUser(...);
 * } catch (err) {
 *   if (ElasticsearchErrorHelpers.isNotAuthorizedError(err)) {
 *     const authHeader = err.output.headers['WWW-Authenticate'];
 *   }
 * ```
 */


class LegacyElasticsearchErrorHelpers {
  static isNotAuthorizedError(error) {
    return isElasticsearchError(error) && error[code] === ErrorCode.NOT_AUTHORIZED;
  }

  static decorateNotAuthorizedError(error, reason) {
    const decoratedError = decorate(error, ErrorCode.NOT_AUTHORIZED, 401, reason);
    const wwwAuthHeader = (0, _lodash.get)(error, 'body.error.header[WWW-Authenticate]');
    decoratedError.output.headers['WWW-Authenticate'] = wwwAuthHeader || 'Basic realm="Authorization Required"';
    return decoratedError;
  }

}

exports.LegacyElasticsearchErrorHelpers = LegacyElasticsearchErrorHelpers;