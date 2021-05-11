"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegacyScopedClusterClient = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * {@inheritDoc IScopedClusterClient}
 * @deprecated Use {@link IScopedClusterClient | scoped cluster client}.
 * @public
 */
class LegacyScopedClusterClient {
  constructor(internalAPICaller, scopedAPICaller, headers) {
    this.internalAPICaller = internalAPICaller;
    this.scopedAPICaller = scopedAPICaller;
    this.headers = headers;
    this.callAsCurrentUser = this.callAsCurrentUser.bind(this);
    this.callAsInternalUser = this.callAsInternalUser.bind(this);
  }
  /**
   * Calls specified `endpoint` with provided `clientParams` on behalf of the
   * Kibana internal user.
   * See {@link LegacyAPICaller}.
   * @deprecated Use {@link IScopedClusterClient.asInternalUser}.
   *
   * @param endpoint - String descriptor of the endpoint e.g. `cluster.getSettings` or `ping`.
   * @param clientParams - A dictionary of parameters that will be passed directly to the Elasticsearch JS client.
   * @param options - Options that affect the way we call the API and process the result.
   */


  callAsInternalUser(endpoint, clientParams = {}, options) {
    return this.internalAPICaller(endpoint, clientParams, options);
  }
  /**
   * Calls specified `endpoint` with provided `clientParams` on behalf of the
   * user initiated request to the Kibana server (via HTTP request headers).
   * See {@link LegacyAPICaller}.
   * @deprecated Use {@link IScopedClusterClient.asCurrentUser}.
   *
   * @param endpoint - String descriptor of the endpoint e.g. `cluster.getSettings` or `ping`.
   * @param clientParams - A dictionary of parameters that will be passed directly to the Elasticsearch JS client.
   * @param options - Options that affect the way we call the API and process the result.
   */


  callAsCurrentUser(endpoint, clientParams = {}, options) {
    const defaultHeaders = this.headers;

    if (defaultHeaders !== undefined) {
      const customHeaders = clientParams.headers;

      if ((0, _lodash.isObject)(customHeaders)) {
        const duplicates = (0, _lodash.intersection)(Object.keys(defaultHeaders), Object.keys(customHeaders));
        duplicates.forEach(duplicate => {
          if (defaultHeaders[duplicate] !== customHeaders[duplicate]) {
            throw Error(`Cannot override default header ${duplicate}.`);
          }
        });
      }

      clientParams.headers = Object.assign({}, clientParams.headers, this.headers);
    }

    return this.scopedAPICaller(endpoint, clientParams, options);
  }

}

exports.LegacyScopedClusterClient = LegacyScopedClusterClient;