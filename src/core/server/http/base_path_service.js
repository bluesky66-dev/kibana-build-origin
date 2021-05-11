"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasePath = void 0;

var _std = require("@kbn/std");

var _router = require("./router");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Access or manipulate the Kibana base path
 *
 * @public
 */
class BasePath {
  /**
   * returns the server's basePath
   *
   * See {@link BasePath.get} for getting the basePath value for a specific request
   */

  /**
   * The server's publicly exposed base URL, if configured. Includes protocol, host, port (optional) and the
   * {@link BasePath.serverBasePath}.
   *
   * @remarks
   * Should be used for generating external URL links back to this Kibana instance.
   */

  /** @internal */
  constructor(serverBasePath = '', publicBaseUrl) {
    _defineProperty(this, "basePathCache", new WeakMap());

    _defineProperty(this, "serverBasePath", void 0);

    _defineProperty(this, "publicBaseUrl", void 0);

    _defineProperty(this, "get", request => {
      const requestScopePath = this.basePathCache.get((0, _router.ensureRawRequest)(request)) || '';
      return `${this.serverBasePath}${requestScopePath}`;
    });

    _defineProperty(this, "set", (request, requestSpecificBasePath) => {
      const rawRequest = (0, _router.ensureRawRequest)(request);

      if (this.basePathCache.has(rawRequest)) {
        throw new Error('Request basePath was previously set. Setting multiple times is not supported.');
      }

      this.basePathCache.set(rawRequest, requestSpecificBasePath);
    });

    _defineProperty(this, "prepend", path => {
      if (this.serverBasePath === '') return path;
      return (0, _std.modifyUrl)(path, parts => {
        if (!parts.hostname && parts.pathname && parts.pathname.startsWith('/')) {
          parts.pathname = `${this.serverBasePath}${parts.pathname}`;
        }
      });
    });

    _defineProperty(this, "remove", path => {
      if (this.serverBasePath === '') {
        return path;
      }

      if (path === this.serverBasePath) {
        return '/';
      }

      if (path.startsWith(`${this.serverBasePath}/`)) {
        return path.slice(this.serverBasePath.length);
      }

      return path;
    });

    this.serverBasePath = serverBasePath;
    this.publicBaseUrl = publicBaseUrl;
  }
  /**
   * returns `basePath` value, specific for an incoming request.
   */


}
/**
 * Access or manipulate the Kibana base path
 *
 * {@link BasePath}
 * @public
 */


exports.BasePath = BasePath;