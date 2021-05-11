"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenAuthenticationProvider = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _constants = require("../../../common/constants");

var _errors = require("../../errors");

var _authentication_result = require("../authentication_result");

var _deauthentication_result = require("../deauthentication_result");

var _can_redirect_request = require("../can_redirect_request");

var _http_authentication = require("../http_authentication");

var _tokens = require("../tokens");

var _base = require("./base");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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
 * Provider that supports token-based request authentication.
 */


class TokenAuthenticationProvider extends _base.BaseAuthenticationProvider {
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

    try {
      // First attempt to exchange login credentials for an access token
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        authentication: authenticationInfo
      } = (await this.options.client.asInternalUser.security.getToken({
        body: {
          grant_type: 'password',
          username,
          password
        }
      })).body;
      this.logger.debug('Get token API request to Elasticsearch successful');
      return _authentication_result.AuthenticationResult.succeeded(this.authenticationInfoToAuthenticatedUser(authenticationInfo), {
        authHeaders: {
          authorization: new _http_authentication.HTTPAuthorizationHeader('Bearer', accessToken).toString()
        },
        state: {
          accessToken,
          refreshToken
        }
      });
    } catch (err) {
      this.logger.debug(`Failed to perform a login: ${(0, _errors.getDetailedErrorMessage)(err)}`);
      return _authentication_result.AuthenticationResult.failed(err);
    }
  }
  /**
   * Performs token-based request authentication
   * @param request Request instance.
   * @param [state] Optional state object associated with the provider.
   */


  async authenticate(request, state) {
    this.logger.debug(`Trying to authenticate user request to ${request.url.pathname}${request.url.search}.`);

    if (_http_authentication.HTTPAuthorizationHeader.parseFromRequest(request) != null) {
      this.logger.debug('Cannot authenticate requests with `Authorization` header.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    let authenticationResult = _authentication_result.AuthenticationResult.notHandled();

    if (state) {
      authenticationResult = await this.authenticateViaState(request, state);

      if (authenticationResult.failed() && _tokens.Tokens.isAccessTokenExpiredError(authenticationResult.error)) {
        authenticationResult = await this.authenticateViaRefreshToken(request, state);
      }
    } // finally, if authentication still can not be handled for this
    // request/state combination, redirect to the login page if appropriate


    if (authenticationResult.notHandled() && canStartNewSession(request)) {
      this.logger.debug('Redirecting request to Login page.');
      authenticationResult = _authentication_result.AuthenticationResult.redirectTo(this.getLoginPageURL(request));
    }

    return authenticationResult;
  }
  /**
   * Redirects user to the login page preserving query string parameters.
   * @param request Request instance.
   * @param state State value previously stored by the provider.
   */


  async logout(request, state) {
    this.logger.debug(`Trying to log user out via ${request.url.pathname}${request.url.search}.`); // Having a `null` state means that provider was specifically called to do a logout, but when
    // session isn't defined then provider is just being probed whether or not it can perform logout.

    if (state === undefined) {
      this.logger.debug('There are no access and refresh tokens to invalidate.');
      return _deauthentication_result.DeauthenticationResult.notHandled();
    }

    this.logger.debug('Token-based logout has been initiated by the user.');

    if (state) {
      try {
        await this.options.tokens.invalidate(state);
      } catch (err) {
        this.logger.debug(`Failed invalidating user's access token: ${err.message}`);
        return _deauthentication_result.DeauthenticationResult.failed(err);
      }
    }

    return _deauthentication_result.DeauthenticationResult.redirectTo(this.options.urls.loggedOut(request));
  }
  /**
   * Returns HTTP authentication scheme (`Bearer`) that's used within `Authorization` HTTP header
   * that provider attaches to all successfully authenticated requests to Elasticsearch.
   */


  getHTTPAuthenticationScheme() {
    return 'bearer';
  }
  /**
   * Tries to extract authorization header from the state and adds it to the request before
   * it's forwarded to Elasticsearch backend.
   * @param request Request instance.
   * @param state State value previously stored by the provider.
   */


  async authenticateViaState(request, {
    accessToken
  }) {
    this.logger.debug('Trying to authenticate via state.');

    try {
      const authHeaders = {
        authorization: new _http_authentication.HTTPAuthorizationHeader('Bearer', accessToken).toString()
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
  /**
   * This method is only called when authentication via access token stored in the state failed because of expired
   * token. So we should use refresh token, that is also stored in the state, to extend expired access token and
   * authenticate user with it.
   * @param request Request instance.
   * @param state State value previously stored by the provider.
   */


  async authenticateViaRefreshToken(request, state) {
    this.logger.debug('Trying to refresh access token.');
    let refreshTokenResult;

    try {
      refreshTokenResult = await this.options.tokens.refresh(state.refreshToken);
    } catch (err) {
      return _authentication_result.AuthenticationResult.failed(err);
    } // If refresh token is no longer valid, then we should clear session and redirect user to the
    // login page to re-authenticate, or fail if redirect isn't possible.


    if (refreshTokenResult === null) {
      if (canStartNewSession(request)) {
        this.logger.debug('Clearing session since both access and refresh tokens are expired.'); // Set state to `null` to let `Authenticator` know that we want to clear current session.

        return _authentication_result.AuthenticationResult.redirectTo(this.getLoginPageURL(request), {
          state: null
        });
      }

      return _authentication_result.AuthenticationResult.failed(_boom.default.badRequest('Both access and refresh tokens are expired.'));
    }

    this.logger.debug('Request has been authenticated via refreshed token.');
    const {
      accessToken,
      refreshToken,
      authenticationInfo
    } = refreshTokenResult;
    return _authentication_result.AuthenticationResult.succeeded(this.authenticationInfoToAuthenticatedUser(authenticationInfo), {
      authHeaders: {
        authorization: new _http_authentication.HTTPAuthorizationHeader('Bearer', accessToken).toString()
      },
      state: {
        accessToken,
        refreshToken
      }
    });
  }
  /**
   * Constructs login page URL using current url path as `next` query string parameter.
   * @param request Request instance.
   */


  getLoginPageURL(request) {
    const nextURL = encodeURIComponent(`${this.options.basePath.get(request)}${request.url.pathname}${request.url.search}`);
    return `${this.options.basePath.get(request)}/login?${_constants.NEXT_URL_QUERY_STRING_PARAMETER}=${nextURL}`;
  }

}

exports.TokenAuthenticationProvider = TokenAuthenticationProvider;

_defineProperty(TokenAuthenticationProvider, "type", 'token');