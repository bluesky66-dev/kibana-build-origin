"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adoptToHapiAuthFormat = adoptToHapiAuthFormat;
exports.AuthResultType = void 0;

var _router = require("../router");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public */
let AuthResultType;
/** @public */

exports.AuthResultType = AuthResultType;

(function (AuthResultType) {
  AuthResultType["authenticated"] = "authenticated";
  AuthResultType["notHandled"] = "notHandled";
  AuthResultType["redirected"] = "redirected";
})(AuthResultType || (exports.AuthResultType = AuthResultType = {}));

const authResult = {
  authenticated(data = {}) {
    return {
      type: AuthResultType.authenticated,
      state: data.state,
      requestHeaders: data.requestHeaders,
      responseHeaders: data.responseHeaders
    };
  },

  notHandled() {
    return {
      type: AuthResultType.notHandled
    };
  },

  redirected(headers) {
    return {
      type: AuthResultType.redirected,
      headers
    };
  },

  isAuthenticated(result) {
    return (result === null || result === void 0 ? void 0 : result.type) === AuthResultType.authenticated;
  },

  isNotHandled(result) {
    return (result === null || result === void 0 ? void 0 : result.type) === AuthResultType.notHandled;
  },

  isRedirected(result) {
    return (result === null || result === void 0 ? void 0 : result.type) === AuthResultType.redirected;
  }

};
/**
 * Auth Headers map
 * @public
 */

const toolkit = {
  authenticated: authResult.authenticated,
  notHandled: authResult.notHandled,
  redirected: authResult.redirected
};
/**
 * See {@link AuthToolkit}.
 * @public
 */

/** @public */
function adoptToHapiAuthFormat(fn, log, onAuth = () => undefined) {
  return async function interceptAuth(request, responseToolkit) {
    const hapiResponseAdapter = new _router.HapiResponseAdapter(responseToolkit);

    const kibanaRequest = _router.KibanaRequest.from(request, undefined, false);

    try {
      const result = await fn(kibanaRequest, _router.lifecycleResponseFactory, toolkit);

      if ((0, _router.isKibanaResponse)(result)) {
        return hapiResponseAdapter.handle(result);
      }

      if (authResult.isAuthenticated(result)) {
        onAuth(request, {
          state: result.state,
          requestHeaders: result.requestHeaders,
          responseHeaders: result.responseHeaders
        });
        return responseToolkit.authenticated({
          credentials: result.state || {}
        });
      }

      if (authResult.isRedirected(result)) {
        // we cannot redirect a user when resources with optional auth requested
        if (kibanaRequest.route.options.authRequired === 'optional') {
          return responseToolkit.continue;
        }

        return hapiResponseAdapter.handle(_router.lifecycleResponseFactory.redirected({
          // hapi doesn't accept string[] as a valid header
          headers: result.headers
        }));
      }

      if (authResult.isNotHandled(result)) {
        if (kibanaRequest.route.options.authRequired === 'optional') {
          return responseToolkit.continue;
        }

        return hapiResponseAdapter.handle(_router.lifecycleResponseFactory.unauthorized());
      }

      throw new Error(`Unexpected result from Authenticate. Expected AuthResult or KibanaResponse, but given: ${result}.`);
    } catch (error) {
      log.error(error);
      return hapiResponseAdapter.toInternalError();
    }
  };
}