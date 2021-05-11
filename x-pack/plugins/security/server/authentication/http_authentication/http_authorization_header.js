"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPAuthorizationHeader = void 0;

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class HTTPAuthorizationHeader {
  /**
   * The authentication scheme. Should be consumed in a case-insensitive manner.
   * https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml#authschemes
   */

  /**
   * The authentication credentials for the scheme.
   */
  constructor(scheme, credentials) {
    _defineProperty(this, "scheme", void 0);

    _defineProperty(this, "credentials", void 0);

    this.scheme = scheme;
    this.credentials = credentials;
  }
  /**
   * Parses request's `Authorization` HTTP header if present.
   * @param request Request instance to extract the authorization header from.
   */


  static parseFromRequest(request) {
    const authorizationHeaderValue = request.headers.authorization;

    if (!authorizationHeaderValue || typeof authorizationHeaderValue !== 'string') {
      return null;
    }

    const [scheme] = authorizationHeaderValue.split(/\s+/);
    const credentials = authorizationHeaderValue.substring(scheme.length + 1);
    return new HTTPAuthorizationHeader(scheme, credentials);
  }

  toString() {
    return `${this.scheme} ${this.credentials}`;
  }

}

exports.HTTPAuthorizationHeader = HTTPAuthorizationHeader;