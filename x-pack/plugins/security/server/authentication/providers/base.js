"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseAuthenticationProvider = void 0;

var _std = require("@kbn/std");

var _authentication_result = require("../authentication_result");

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
 * Base class that all authentication providers should extend.
 */


class BaseAuthenticationProvider {
  /**
   * Type of the provider.
   */

  /**
   * Type of the provider. We use `this.constructor` trick to get access to the static `type` field
   * of the specific `BaseAuthenticationProvider` subclass.
   */

  /**
   * Logger instance bound to a specific provider context.
   */

  /**
   * Instantiates AuthenticationProvider.
   * @param options Provider options object.
   */
  constructor(options) {
    this.options = options;

    _defineProperty(this, "type", this.constructor.type);

    _defineProperty(this, "logger", void 0);

    this.logger = options.logger;
  }
  /**
   * Performs initial login request and creates user session. Provider isn't required to implement
   * this method if it doesn't support initial login request.
   * @param request Request instance.
   * @param loginAttempt Login attempt associated with the provider.
   * @param [state] Optional state object associated with the provider.
   */


  async login(request, loginAttempt, state) {
    return _authentication_result.AuthenticationResult.notHandled();
  }
  /**
   * Performs request authentication based on the session created during login or other information
   * associated with the request (e.g. `Authorization` HTTP header).
   * @param request Request instance.
   * @param [state] Optional state object associated with the provider.
   */

  /**
   * Queries Elasticsearch `_authenticate` endpoint to authenticate request and retrieve the user
   * information of authenticated user.
   * @param request Request instance.
   * @param [authHeaders] Optional `Headers` dictionary to send with the request.
   */


  async getUser(request, authHeaders = {}) {
    return this.authenticationInfoToAuthenticatedUser((await this.options.client.asScoped({
      headers: { ...request.headers,
        ...authHeaders
      }
    }).asCurrentUser.security.authenticate()).body);
  }
  /**
   * Converts Elasticsearch Authentication result to a Kibana authenticated user.
   * @param authenticationInfo Result returned from the `_authenticate` operation.
   */


  authenticationInfoToAuthenticatedUser(authenticationInfo) {
    return (0, _std.deepFreeze)({ ...authenticationInfo,
      authentication_provider: {
        type: this.type,
        name: this.options.name
      }
    });
  }

}

exports.BaseAuthenticationProvider = BaseAuthenticationProvider;

_defineProperty(BaseAuthenticationProvider, "type", void 0);