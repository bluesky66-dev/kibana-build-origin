"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthHeadersStorage = void 0;

var _router = require("./router");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class AuthHeadersStorage {
  constructor() {
    _defineProperty(this, "authHeadersCache", new WeakMap());

    _defineProperty(this, "set", (request, headers) => {
      this.authHeadersCache.set((0, _router.ensureRawRequest)(request), headers);
    });

    _defineProperty(this, "get", request => {
      return this.authHeadersCache.get((0, _router.ensureRawRequest)(request));
    });
  }

}

exports.AuthHeadersStorage = AuthHeadersStorage;