"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnonymousAuthenticationProvider = void 0;

var _errors = require("../../errors");

var _authentication_result = require("../authentication_result");

var _can_redirect_request = require("../can_redirect_request");

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
 * Checks whether current request can initiate a new session.
 * @param request Request instance.
 */


function canStartNewSession(request) {
  // We should try to establish new session only if request requires authentication and it's not XHR request.
  // Technically we can authenticate XHR requests too, but we don't want these to create a new session unintentionally.
  return (0, _can_redirect_request.canRedirectRequest)(request) && request.route.options.authRequired === true;
}
/**
 * Checks whether specified `credentials` define an API key.
 * @param credentials
 */


function isAPIKeyCredentials(credentials) {
  return !!credentials.apiKey;
}
/**
 * Provider that supports anonymous request authentication.
 */


class AnonymousAuthenticationProvider extends _base.BaseAuthenticationProvider {
  /**
   * Type of the provider.
   */

  /**
   * Defines HTTP authorization header that should be used to authenticate request. It isn't defined
   * if provider should rely on Elasticsearch native anonymous access.
   */

  /**
   * Create authorization header for the specified credentials. Returns `null` if credentials imply
   * Elasticsearch anonymous user.
   * @param credentials Credentials to create HTTP authorization header for.
   */
  static createHTTPAuthorizationHeader(credentials) {
    if (credentials === 'elasticsearch_anonymous_user') {
      return null;
    }

    if (isAPIKeyCredentials(credentials)) {
      return new _http_authentication.HTTPAuthorizationHeader('ApiKey', typeof credentials.apiKey === 'string' ? credentials.apiKey : new _http_authentication.BasicHTTPAuthorizationHeaderCredentials(credentials.apiKey.id, credentials.apiKey.key).toString());
    }

    return new _http_authentication.HTTPAuthorizationHeader('Basic', new _http_authentication.BasicHTTPAuthorizationHeaderCredentials(credentials.username, credentials.password).toString());
  }

  constructor(options, anonymousOptions) {
    super(options);
    this.options = options;

    _defineProperty(this, "httpAuthorizationHeader", void 0);

    const credentials = anonymousOptions === null || anonymousOptions === void 0 ? void 0 : anonymousOptions.credentials;

    if (!credentials) {
      throw new Error('Credentials must be specified');
    }

    if (credentials === 'elasticsearch_anonymous_user') {
      this.logger.debug('Anonymous requests will be authenticated using Elasticsearch native anonymous user.');
    } else if (isAPIKeyCredentials(credentials)) {
      this.logger.debug('Anonymous requests will be authenticated via API key.');
    } else {
      this.logger.debug('Anonymous requests will be authenticated via username and password.');
    }

    this.httpAuthorizationHeader = AnonymousAuthenticationProvider.createHTTPAuthorizationHeader(credentials);
  }
  /**
   * Performs initial login request.
   * @param request Request instance.
   * @param state Optional state value previously stored by the provider.
   */


  async login(request, state) {
    this.logger.debug('Trying to perform a login.');
    return this.authenticateViaAuthorizationHeader(request, state);
  }
  /**
   * Performs request authentication.
   * @param request Request instance.
   * @param state Optional state value previously stored by the provider.
   */


  async authenticate(request, state) {
    this.logger.debug(`Trying to authenticate user request to ${request.url.pathname}${request.url.search}.`);

    if (_http_authentication.HTTPAuthorizationHeader.parseFromRequest(request) != null) {
      this.logger.debug('Cannot authenticate requests with `Authorization` header.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    if (state || canStartNewSession(request)) {
      return this.authenticateViaAuthorizationHeader(request, state);
    }

    return _authentication_result.AuthenticationResult.notHandled();
  }
  /**
   * Redirects user to the logged out page.
   * @param request Request instance.
   * @param state Optional state value previously stored by the provider.
   */


  async logout(request, state) {
    this.logger.debug(`Logout is initiated by request to ${request.url.pathname}${request.url.search}.`); // Having a `null` state means that provider was specifically called to do a logout, but when
    // session isn't defined then provider is just being probed whether or not it can perform logout.

    if (state === undefined) {
      return _deauthentication_result.DeauthenticationResult.notHandled();
    }

    return _deauthentication_result.DeauthenticationResult.redirectTo(this.options.urls.loggedOut(request));
  }
  /**
   * Returns HTTP authentication scheme (`Basic` or `ApiKey`) that's used within `Authorization`
   * HTTP header that provider attaches to all successfully authenticated requests to Elasticsearch.
   */


  getHTTPAuthenticationScheme() {
    var _this$httpAuthorizati, _this$httpAuthorizati2;

    return (_this$httpAuthorizati = (_this$httpAuthorizati2 = this.httpAuthorizationHeader) === null || _this$httpAuthorizati2 === void 0 ? void 0 : _this$httpAuthorizati2.scheme.toLowerCase()) !== null && _this$httpAuthorizati !== void 0 ? _this$httpAuthorizati : null;
  }
  /**
   * Tries to authenticate user request via configured credentials encoded into `Authorization` header.
   * @param request Request instance.
   * @param state State value previously stored by the provider.
   */


  async authenticateViaAuthorizationHeader(request, state) {
    const authHeaders = this.httpAuthorizationHeader ? {
      authorization: this.httpAuthorizationHeader.toString()
    } : {};

    try {
      const user = await this.getUser(request, authHeaders);
      this.logger.debug(`Request to ${request.url.pathname}${request.url.search} has been authenticated.`); // Create session only if it doesn't exist yet, otherwise keep it unchanged.

      return _authentication_result.AuthenticationResult.succeeded(user, {
        authHeaders,
        state: state ? undefined : {}
      });
    } catch (err) {
      if ((0, _errors.getErrorStatusCode)(err) === 401) {
        if (!this.httpAuthorizationHeader) {
          this.logger.error(`Failed to authenticate anonymous request using Elasticsearch reserved anonymous user. Anonymous access may not be properly configured in Elasticsearch: ${err.message}`);
        } else if (this.httpAuthorizationHeader.scheme.toLowerCase() === 'basic') {
          this.logger.error(`Failed to authenticate anonymous request using provided username/password credentials. The user with the provided username may not exist or the password is wrong: ${err.message}`);
        } else {
          this.logger.error(`Failed to authenticate anonymous request using provided API key. The key may not exist or expired: ${err.message}`);
        }
      } else {
        this.logger.error(`Failed to authenticate request : ${err.message}`);
      }

      return _authentication_result.AuthenticationResult.failed(err);
    }
  }

}

exports.AnonymousAuthenticationProvider = AnonymousAuthenticationProvider;

_defineProperty(AnonymousAuthenticationProvider, "type", 'anonymous');