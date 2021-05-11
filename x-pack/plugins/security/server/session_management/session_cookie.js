"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionCookie = void 0;

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

/**
 * Represents shape of the session value stored in the cookie.
 */


class SessionCookie {
  /**
   * Promise containing initialized cookie session storage factory.
   */

  /**
   * Session cookie logger.
   */

  /**
   * Base path of the Kibana server instance.
   */
  constructor({
    config,
    createCookieSessionStorageFactory,
    logger,
    serverBasePath
  }) {
    _defineProperty(this, "cookieSessionValueStorage", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "serverBasePath", void 0);

    this.logger = logger;
    this.serverBasePath = serverBasePath;
    this.cookieSessionValueStorage = createCookieSessionStorageFactory({
      encryptionKey: config.encryptionKey,
      isSecure: config.secureCookies,
      name: config.cookieName,
      sameSite: config.sameSiteCookies,
      validate: sessionValue => {
        // ensure that this cookie was created with the current Kibana configuration
        const invalidSessionValue = (Array.isArray(sessionValue) ? sessionValue : [sessionValue]).find(sess => sess.path !== undefined && sess.path !== serverBasePath);

        if (invalidSessionValue) {
          this.logger.debug(`Outdated session value with path "${invalidSessionValue.path}"`);
          return {
            isValid: false,
            path: invalidSessionValue.path
          };
        }

        return {
          isValid: true
        };
      }
    });
  }
  /**
   * Extracts session value for the specified request.
   * @param request Request instance to get session value for.
   */


  async get(request) {
    const sessionStorage = (await this.cookieSessionValueStorage).asScoped(request);
    const sessionValue = await sessionStorage.get(); // If we detect that cookie session value is in incompatible format, then we should clear such
    // cookie.

    if (sessionValue && !SessionCookie.isSupportedSessionValue(sessionValue)) {
      sessionStorage.clear();
      return null;
    }

    return sessionValue;
  }
  /**
   * Creates or updates session value for the specified request.
   * @param request Request instance to set session value for.
   * @param sessionValue Session value parameters.
   */


  async set(request, sessionValue) {
    (await this.cookieSessionValueStorage).asScoped(request).set({ ...sessionValue,
      path: this.serverBasePath
    });
  }
  /**
   * Clears session value for the specified request.
   * @param request Request instance to clear session value for.
   */


  async clear(request) {
    (await this.cookieSessionValueStorage).asScoped(request).clear();
  }
  /**
   * Determines if session value was created by the current Kibana version. Previous versions had a different session value format.
   * @param sessionValue The session value to check.
   */


  static isSupportedSessionValue(sessionValue) {
    return typeof (sessionValue === null || sessionValue === void 0 ? void 0 : sessionValue.sid) === 'string' && typeof (sessionValue === null || sessionValue === void 0 ? void 0 : sessionValue.aad) === 'string';
  }

}

exports.SessionCookie = SessionCookie;