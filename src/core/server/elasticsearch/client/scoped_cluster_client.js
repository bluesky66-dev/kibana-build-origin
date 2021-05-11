"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScopedClusterClient = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Serves the same purpose as the normal {@link IClusterClient | cluster client} but exposes
 * an additional `asCurrentUser` method that doesn't use credentials of the Kibana internal
 * user (as `asInternalUser` does) to request Elasticsearch API, but rather passes HTTP headers
 * extracted from the current user request to the API instead.
 *
 * @public
 **/

/** @internal **/
class ScopedClusterClient {
  constructor(asInternalUser, asCurrentUser) {
    this.asInternalUser = asInternalUser;
    this.asCurrentUser = asCurrentUser;
  }

}

exports.ScopedClusterClient = ScopedClusterClient;