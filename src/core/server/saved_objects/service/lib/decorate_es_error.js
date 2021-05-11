"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decorateEsError = decorateEsError;

var _elasticsearch = require("@elastic/elasticsearch");

var _lodash = require("lodash");

var _errors = require("./errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const responseErrors = {
  isServiceUnavailable: statusCode => statusCode === 503,
  isConflict: statusCode => statusCode === 409,
  isNotAuthorized: statusCode => statusCode === 401,
  isForbidden: statusCode => statusCode === 403,
  isRequestEntityTooLarge: statusCode => statusCode === 413,
  isNotFound: statusCode => statusCode === 404,
  isBadRequest: statusCode => statusCode === 400,
  isTooManyRequests: statusCode => statusCode === 429
};
const {
  ConnectionError,
  NoLivingConnectionsError,
  TimeoutError
} = _elasticsearch.errors;
const SCRIPT_CONTEXT_DISABLED_REGEX = /(?:cannot execute scripts using \[)([a-z]*)(?:\] context)/;
const INLINE_SCRIPTS_DISABLED_MESSAGE = 'cannot execute [inline] scripts';

function decorateEsError(error) {
  if (!(error instanceof Error)) {
    throw new Error('Expected an instance of Error');
  }

  const {
    reason
  } = (0, _lodash.get)(error, 'body.error', {
    reason: undefined
  });

  if (error instanceof ConnectionError || error instanceof NoLivingConnectionsError || error instanceof TimeoutError || responseErrors.isServiceUnavailable(error.statusCode)) {
    return _errors.SavedObjectsErrorHelpers.decorateEsUnavailableError(error, reason);
  }

  if (responseErrors.isConflict(error.statusCode)) {
    return _errors.SavedObjectsErrorHelpers.decorateConflictError(error, reason);
  }

  if (responseErrors.isNotAuthorized(error.statusCode)) {
    return _errors.SavedObjectsErrorHelpers.decorateNotAuthorizedError(error, reason);
  }

  if (responseErrors.isForbidden(error.statusCode)) {
    return _errors.SavedObjectsErrorHelpers.decorateForbiddenError(error, reason);
  }

  if (responseErrors.isRequestEntityTooLarge(error.statusCode)) {
    return _errors.SavedObjectsErrorHelpers.decorateRequestEntityTooLargeError(error, reason);
  }

  if (responseErrors.isNotFound(error.statusCode)) {
    var _error$meta, _error$meta$body, _error$meta$body$erro, _error$meta$body$erro2;

    const match = error === null || error === void 0 ? void 0 : (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : (_error$meta$body$erro = _error$meta$body.error) === null || _error$meta$body$erro === void 0 ? void 0 : (_error$meta$body$erro2 = _error$meta$body$erro.reason) === null || _error$meta$body$erro2 === void 0 ? void 0 : _error$meta$body$erro2.match(/no such index \[(.+)\] and \[require_alias\] request flag is \[true\] and \[.+\] is not an alias/);

    if ((match === null || match === void 0 ? void 0 : match.length) > 0) {
      return _errors.SavedObjectsErrorHelpers.decorateIndexAliasNotFoundError(error, match[1]);
    }

    return _errors.SavedObjectsErrorHelpers.createGenericNotFoundError();
  }

  if (responseErrors.isTooManyRequests(error.statusCode)) {
    return _errors.SavedObjectsErrorHelpers.decorateTooManyRequestsError(error, reason);
  }

  if (responseErrors.isBadRequest(error.statusCode)) {
    if (SCRIPT_CONTEXT_DISABLED_REGEX.test(reason || '') || reason === INLINE_SCRIPTS_DISABLED_MESSAGE) {
      return _errors.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(error, reason);
    }

    return _errors.SavedObjectsErrorHelpers.decorateBadRequestError(error, reason);
  }

  return _errors.SavedObjectsErrorHelpers.decorateGeneralError(error, reason);
}