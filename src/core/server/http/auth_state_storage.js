"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthStateStorage = exports.AuthStatus = void 0;

var _router = require("./router");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Status indicating an outcome of the authentication.
 * @public
 */
let AuthStatus;
/**
 * Gets authentication state for a request. Returned by `auth` interceptor.
 * @param request {@link KibanaRequest} - an incoming request.
 * @public
 */

exports.AuthStatus = AuthStatus;

(function (AuthStatus) {
  AuthStatus["authenticated"] = "authenticated";
  AuthStatus["unauthenticated"] = "unauthenticated";
  AuthStatus["unknown"] = "unknown";
})(AuthStatus || (exports.AuthStatus = AuthStatus = {}));

/** @internal */
class AuthStateStorage {
  constructor(canBeAuthenticated) {
    this.canBeAuthenticated = canBeAuthenticated;

    _defineProperty(this, "storage", new WeakMap());

    _defineProperty(this, "set", (request, state) => {
      this.storage.set((0, _router.ensureRawRequest)(request), state);
    });

    _defineProperty(this, "get", request => {
      const key = (0, _router.ensureRawRequest)(request);
      const state = this.storage.get(key);
      const status = this.storage.has(key) ? AuthStatus.authenticated : this.canBeAuthenticated() ? AuthStatus.unauthenticated : AuthStatus.unknown;
      return {
        status,
        state
      };
    });

    _defineProperty(this, "isAuthenticated", request => {
      return this.get(request).status === AuthStatus.authenticated;
    });
  }

}

exports.AuthStateStorage = AuthStateStorage;