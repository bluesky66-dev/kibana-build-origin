"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginDiscoveryError = exports.PluginDiscoveryErrorType = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
let PluginDiscoveryErrorType;
/** @internal */

exports.PluginDiscoveryErrorType = PluginDiscoveryErrorType;

(function (PluginDiscoveryErrorType) {
  PluginDiscoveryErrorType["IncompatibleVersion"] = "incompatible-version";
  PluginDiscoveryErrorType["InvalidSearchPath"] = "invalid-search-path";
  PluginDiscoveryErrorType["InvalidPluginPath"] = "invalid-plugin-path";
  PluginDiscoveryErrorType["InvalidManifest"] = "invalid-manifest";
  PluginDiscoveryErrorType["MissingManifest"] = "missing-manifest";
})(PluginDiscoveryErrorType || (exports.PluginDiscoveryErrorType = PluginDiscoveryErrorType = {}));

class PluginDiscoveryError extends Error {
  static incompatibleVersion(path, cause) {
    return new PluginDiscoveryError(PluginDiscoveryErrorType.IncompatibleVersion, path, cause);
  }

  static invalidSearchPath(path, cause) {
    return new PluginDiscoveryError(PluginDiscoveryErrorType.InvalidSearchPath, path, cause);
  }

  static invalidPluginPath(path, cause) {
    return new PluginDiscoveryError(PluginDiscoveryErrorType.InvalidPluginPath, path, cause);
  }

  static invalidManifest(path, cause) {
    return new PluginDiscoveryError(PluginDiscoveryErrorType.InvalidManifest, path, cause);
  }

  static missingManifest(path, cause) {
    return new PluginDiscoveryError(PluginDiscoveryErrorType.MissingManifest, path, cause);
  }
  /**
   * @param type Type of the discovery error (invalid directory, invalid manifest etc.)
   * @param path Path at which discovery error occurred.
   * @param cause "Raw" error object that caused discovery error.
   */


  constructor(type, path, cause) {
    super(`${cause.message} (${type}, ${path})`); // Set the prototype explicitly, see:
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

    this.type = type;
    this.path = path;
    this.cause = cause;
    Object.setPrototypeOf(this, PluginDiscoveryError.prototype);
  }

}

exports.PluginDiscoveryError = PluginDiscoveryError;