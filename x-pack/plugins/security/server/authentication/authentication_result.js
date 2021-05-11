"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticationResult = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents status that `AuthenticationResult` can be in.
 */

var AuthenticationResultStatus;
/**
 * Represents additional authentication options.
 */

(function (AuthenticationResultStatus) {
  AuthenticationResultStatus["NotHandled"] = "not-handled";
  AuthenticationResultStatus["Succeeded"] = "succeeded";
  AuthenticationResultStatus["Failed"] = "failed";
  AuthenticationResultStatus["Redirected"] = "redirected";
})(AuthenticationResultStatus || (AuthenticationResultStatus = {}));
/**
 * Represents the result of an authentication attempt.
 */


class AuthenticationResult {
  /**
   * Produces `AuthenticationResult` for the case when user can't be authenticated with the
   * provided credentials.
   */
  static notHandled() {
    return new AuthenticationResult(AuthenticationResultStatus.NotHandled);
  }
  /**
   * Produces `AuthenticationResult` for the case when authentication succeeds.
   * @param user User information retrieved as a result of successful authentication attempt.
   * @param [authHeaders] Optional dictionary of the HTTP headers with authentication information.
   * @param [authResponseHeaders] Optional dictionary of the HTTP headers with authentication
   * information that should be specified in the response we send to the client request.
   * @param [state] Optional state to be stored and reused for the next request.
   */


  static succeeded(user, {
    authHeaders,
    authResponseHeaders,
    state
  } = {}) {
    if (!user) {
      throw new Error('User should be specified.');
    }

    return new AuthenticationResult(AuthenticationResultStatus.Succeeded, {
      user,
      authHeaders,
      authResponseHeaders,
      state
    });
  }
  /**
   * Produces `AuthenticationResult` for the case when authentication fails.
   * @param error Error that occurred during authentication attempt.
   * @param [authResponseHeaders] Optional dictionary of the HTTP headers with authentication related
   * information (e.g. `WWW-Authenticate` with the challenges) that should be specified in the
   * response we send to the client request.
   */


  static failed(error, {
    authResponseHeaders
  } = {}) {
    if (!error) {
      throw new Error('Error should be specified.');
    }

    return new AuthenticationResult(AuthenticationResultStatus.Failed, {
      error,
      authResponseHeaders
    });
  }
  /**
   * Produces `AuthenticationResult` for the case when authentication needs user to be redirected.
   * @param redirectURL URL that should be used to redirect user to complete authentication.
   * @param [user] Optional user information retrieved as a result of successful authentication attempt.
   * @param [authResponseHeaders] Optional dictionary of the HTTP headers with authentication
   * information that should be specified in the response we send to the client request.
   * @param [state] Optional state to be stored and reused for the next request.
   */


  static redirectTo(redirectURL, {
    user,
    authResponseHeaders,
    state
  } = {}) {
    if (!redirectURL) {
      throw new Error('Redirect URL must be specified.');
    }

    return new AuthenticationResult(AuthenticationResultStatus.Redirected, {
      redirectURL,
      user,
      authResponseHeaders,
      state
    });
  }
  /**
   * Authenticated user instance (only available for `succeeded` result).
   */


  get user() {
    return this.options.user;
  }
  /**
   * Headers that include authentication information that should be used to authenticate user for any
   * future requests (only available for `succeeded` result).
   */


  get authHeaders() {
    return this.options.authHeaders;
  }
  /**
   * Optional dictionary of the HTTP headers with authentication related information (e.g.
   * `WWW-Authenticate` with the challenges) that should be specified in the response we send to
   * the client request (only available for `succeeded` and `failed` results). It's possible to define
   * header value as an array of strings since there are cases when it's necessary to send several
   * headers with the same name, but different values (e.g. in case of `WWW-Authenticate` multiple
   * challenges will result in multiple headers, one per challenge, as it's better supported by the
   * browsers than comma separated list within a single header string).
   */


  get authResponseHeaders() {
    return this.options.authResponseHeaders;
  }
  /**
   * State associated with the authenticated user (only available for `succeeded`
   * and `redirected` results).
   */


  get state() {
    return this.options.state;
  }
  /**
   * Error that occurred during authentication (only available for `failed` result).
   */


  get error() {
    return this.options.error;
  }
  /**
   * URL that should be used to redirect user to complete authentication only available
   * for `redirected` result).
   */


  get redirectURL() {
    return this.options.redirectURL;
  }
  /**
   * Constructor is not supposed to be used directly, please use corresponding static factory methods instead.
   * @param status Indicates the status of the authentication result.
   * @param [options] Optional argument that includes additional authentication options.
   */


  constructor(status, options = {}) {
    this.status = status;
    this.options = options;
  }
  /**
   * Indicates that authentication couldn't be performed with the provided credentials.
   */


  notHandled() {
    return this.status === AuthenticationResultStatus.NotHandled;
  }
  /**
   * Indicates that authentication succeeded.
   */


  succeeded() {
    return this.status === AuthenticationResultStatus.Succeeded;
  }
  /**
   * Indicates that authentication failed.
   */


  failed() {
    return this.status === AuthenticationResultStatus.Failed;
  }
  /**
   * Indicates that authentication needs user to be redirected.
   */


  redirected() {
    return this.status === AuthenticationResultStatus.Redirected;
  }
  /**
   * Checks whether authentication result implies state update.
   */


  shouldUpdateState() {
    // State shouldn't be updated in case it wasn't set or was specifically set to `null`.
    return this.options.state != null;
  }
  /**
   * Checks whether authentication result implies state clearing.
   */


  shouldClearState() {
    return this.options.state === null;
  }

}

exports.AuthenticationResult = AuthenticationResult;