"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsErrorHelpers = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// 400 - badRequest
const CODE_BAD_REQUEST = 'SavedObjectsClient/badRequest'; // 400 - invalid version

const CODE_INVALID_VERSION = 'SavedObjectsClient/invalidVersion'; // 401 - Not Authorized

const CODE_NOT_AUTHORIZED = 'SavedObjectsClient/notAuthorized'; // 403 - Forbidden

const CODE_FORBIDDEN = 'SavedObjectsClient/forbidden'; // 413 - Request Entity Too Large

const CODE_REQUEST_ENTITY_TOO_LARGE = 'SavedObjectsClient/requestEntityTooLarge'; // 404 - Not Found

const CODE_NOT_FOUND = 'SavedObjectsClient/notFound'; // 409 - Conflict

const CODE_CONFLICT = 'SavedObjectsClient/conflict'; // 429 - Too Many Requests

const CODE_TOO_MANY_REQUESTS = 'SavedObjectsClient/tooManyRequests'; // 400 - Es Cannot Execute Script

const CODE_ES_CANNOT_EXECUTE_SCRIPT = 'SavedObjectsClient/esCannotExecuteScript'; // 503 - Es Unavailable

const CODE_ES_UNAVAILABLE = 'SavedObjectsClient/esUnavailable'; // 500 - General Error

const CODE_GENERAL_ERROR = 'SavedObjectsClient/generalError';
const code = Symbol('SavedObjectsClientErrorCode');

function decorate(error, errorCode, statusCode, message) {
  if (isSavedObjectsClientError(error)) {
    return error;
  }

  const boom = _boom.default.boomify(error, {
    statusCode,
    message,
    override: false
  });

  boom[code] = errorCode;
  return boom;
}

function isSavedObjectsClientError(error) {
  return Boolean(error && error[code]);
}

function decorateBadRequestError(error, reason) {
  return decorate(error, CODE_BAD_REQUEST, 400, reason);
}
/**
 * @public
 */


class SavedObjectsErrorHelpers {
  static isSavedObjectsClientError(error) {
    return isSavedObjectsClientError(error);
  }

  static decorateBadRequestError(error, reason) {
    return decorateBadRequestError(error, reason);
  }

  static createBadRequestError(reason) {
    return decorateBadRequestError(new Error('Bad Request'), reason);
  }

  static createUnsupportedTypeError(type) {
    return decorateBadRequestError(new Error('Bad Request'), `Unsupported saved object type: '${type}'`);
  }

  static isBadRequestError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_BAD_REQUEST;
  }

  static createInvalidVersionError(versionInput) {
    return decorate(_boom.default.badRequest(`Invalid version [${versionInput}]`), CODE_INVALID_VERSION, 400);
  }

  static isInvalidVersionError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_INVALID_VERSION;
  }

  static decorateNotAuthorizedError(error, reason) {
    return decorate(error, CODE_NOT_AUTHORIZED, 401, reason);
  }

  static isNotAuthorizedError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_NOT_AUTHORIZED;
  }

  static decorateForbiddenError(error, reason) {
    return decorate(error, CODE_FORBIDDEN, 403, reason);
  }

  static isForbiddenError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_FORBIDDEN;
  }

  static decorateRequestEntityTooLargeError(error, reason) {
    return decorate(error, CODE_REQUEST_ENTITY_TOO_LARGE, 413, reason);
  }

  static isRequestEntityTooLargeError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_REQUEST_ENTITY_TOO_LARGE;
  }

  static createGenericNotFoundError(type = null, id = null) {
    if (type && id) {
      return decorate(_boom.default.notFound(`Saved object [${type}/${id}] not found`), CODE_NOT_FOUND, 404);
    }

    return decorate(_boom.default.notFound(), CODE_NOT_FOUND, 404);
  }

  static createIndexAliasNotFoundError(alias) {
    return SavedObjectsErrorHelpers.decorateIndexAliasNotFoundError(_boom.default.internal(), alias);
  }

  static decorateIndexAliasNotFoundError(error, alias) {
    return decorate(error, CODE_GENERAL_ERROR, 500, `Saved object index alias [${alias}] not found`);
  }

  static isNotFoundError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_NOT_FOUND;
  }

  static decorateConflictError(error, reason) {
    return decorate(error, CODE_CONFLICT, 409, reason);
  }

  static createConflictError(type, id, reason) {
    return SavedObjectsErrorHelpers.decorateConflictError(_boom.default.conflict(`Saved object [${type}/${id}] conflict`), reason);
  }

  static isConflictError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_CONFLICT;
  }

  static decorateTooManyRequestsError(error, reason) {
    return decorate(error, CODE_TOO_MANY_REQUESTS, 429, reason);
  }

  static createTooManyRequestsError(type, id) {
    return SavedObjectsErrorHelpers.decorateTooManyRequestsError(_boom.default.tooManyRequests());
  }

  static isTooManyRequestsError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_TOO_MANY_REQUESTS;
  }

  static decorateEsCannotExecuteScriptError(error, reason) {
    return decorate(error, CODE_ES_CANNOT_EXECUTE_SCRIPT, 400, reason);
  }

  static isEsCannotExecuteScriptError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_ES_CANNOT_EXECUTE_SCRIPT;
  }

  static decorateEsUnavailableError(error, reason) {
    return decorate(error, CODE_ES_UNAVAILABLE, 503, reason);
  }

  static isEsUnavailableError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_ES_UNAVAILABLE;
  }

  static decorateGeneralError(error, reason) {
    return decorate(error, CODE_GENERAL_ERROR, 500, reason);
  }

  static isGeneralError(error) {
    return isSavedObjectsClientError(error) && error[code] === CODE_GENERAL_ERROR;
  }

}

exports.SavedObjectsErrorHelpers = SavedObjectsErrorHelpers;