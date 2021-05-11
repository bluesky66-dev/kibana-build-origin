"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicAuthenticationProvider = void 0;

var _constants = require("../../../common/constants");

var _can_redirect_request = require("../can_redirect_request");

var _authentication_result = require("../authentication_result");

var _deauthentication_result = require("../deauthentication_result");

var _http_authentication = require("../http_authentication");

var _base = require("./base");

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
 * Checks whether current request can initiate new session.
 * @param request Request instance.
 */


function canStartNewSession(request) {
  // We should try to establish new session only if request requires authentication and client
  // can be redirected to the login page where they can enter username and password.
  return (0, _can_redirect_request.canRedirectRequest)(request) && request.route.options.authRequired === true;
}
/**
 * Provider that supports request authentication via Basic HTTP Authentication.
 */


class BasicAuthenticationProvider extends _base.BaseAuthenticationProvider {
  /**
   * Type of the provider.
   */

  /**
   * Performs initial login request using username and password.
   * @param request Request instance.
   * @param attempt User credentials.
   * @param [state] Optional state object associated with the provider.
   */
  async login(request, {
    username,
    password
  }, state) {
    this.logger.debug('Trying to perform a login.');
    const authHeaders = {
      authorization: new _http_authentication.HTTPAuthorizationHeader('Basic', new _http_authentication.BasicHTTPAuthorizationHeaderCredentials(username, password).toString()).toString()
    };

    try {
      const user = await this.getUser(request, authHeaders);
      this.logger.debug('Login has been successfully performed.');
      return _authentication_result.AuthenticationResult.succeeded(user, {
        authHeaders,
        state: authHeaders
      });
    } catch (err) {
      this.logger.debug(`Failed to perform a login: ${err.message}`);
      return _authentication_result.AuthenticationResult.failed(err);
    }
  }
  /**
   * Performs request authentication using Basic HTTP Authentication.
   * @param request Request instance.
   * @param [state] Optional state object associated with the provider.
   */


  async authenticate(request, state) {
    this.logger.debug(`Trying to authenticate user request to ${request.url.pathname}${request.url.search}.`);

    if (_http_authentication.HTTPAuthorizationHeader.parseFromRequest(request) != null) {
      this.logger.debug('Cannot authenticate requests with `Authorization` header.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    if (state) {
      return await this.authenticateViaState(request, state);
    } // If state isn't present let's redirect user to the login page.


    if (canStartNewSession(request)) {
      this.logger.debug('Redirecting request to Login page.');
      const basePath = this.options.basePath.get(request);
      return _authentication_result.AuthenticationResult.redirectTo(`${basePath}/login?${_constants.NEXT_URL_QUERY_STRING_PARAMETER}=${encodeURIComponent(`${basePath}${request.url.pathname}${request.url.search}`)}`);
    }

    return _authentication_result.AuthenticationResult.notHandled();
  }
  /**
   * Redirects user to the login page preserving query string parameters.
   * @param request Request instance.
   * @param [state] Optional state object associated with the provider.
   */


  async logout(request, state) {
    this.logger.debug(`Trying to log user out via ${request.url.pathname}${request.url.search}.`); // Having a `null` state means that provider was specifically called to do a logout, but when
    // session isn't defined then provider is just being probed whether or not it can perform logout.

    if (state === undefined) {
      return _deauthentication_result.DeauthenticationResult.notHandled();
    }

    return _deauthentication_result.DeauthenticationResult.redirectTo(this.options.urls.loggedOut(request));
  }
  /**
   * Returns HTTP authentication scheme (`Bearer`) that's used within `Authorization` HTTP header
   * that provider attaches to all successfully authenticated requests to Elasticsearch.
   */


  getHTTPAuthenticationScheme() {
    return 'basic';
  }
  /**
   * Tries to extract authorization header from the state and adds it to the request before
   * it's forwarded to Elasticsearch backend.
   * @param request Request instance.
   * @param state State value previously stored by the provider.
   */


  async authenticateViaState(request, {
    authorization
  }) {
    this.logger.debug('Trying to authenticate via state.');

    if (!authorization) {
      this.logger.debug('Authorization header is not found in state.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    try {
      const authHeaders = {
        authorization
      };
      const user = await this.getUser(request, authHeaders);
      this.logger.debug('Request has been authenticated via state.');
      return _authentication_result.AuthenticationResult.succeeded(user, {
        authHeaders
      });
    } catch (err) {
      this.logger.debug(`Failed to authenticate request via state: ${err.message}`);
      return _authentication_result.AuthenticationResult.failed(err);
    }
  }

}

exports.BasicAuthenticationProvider = BasicAuthenticationProvider;

_defineProperty(BasicAuthenticationProvider, "type", 'basic');