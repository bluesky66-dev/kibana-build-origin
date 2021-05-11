"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrationRetryCallCluster = exports.retryCallCluster = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const retryResponseStatuses = [503, // ServiceUnavailable
401, // AuthorizationException
403, // AuthenticationException
408, // RequestTimeout
410 // Gone
];
/**
 * Retries the provided Elasticsearch API call when a `NoLivingConnectionsError` error is
 * encountered. The API call will be retried once a second, indefinitely, until
 * a successful response or a different error is received.
 *
 * @example
 * ```ts
 * const response = await retryCallCluster(() => client.ping());
 * ```
 *
 * @internal
 */

const retryCallCluster = apiCaller => {
  return (0, _rxjs.defer)(() => apiCaller()).pipe((0, _operators.retryWhen)(errors => errors.pipe((0, _operators.concatMap)(error => (0, _rxjs.iif)(() => error.name === 'NoLivingConnectionsError', (0, _rxjs.timer)(1000), (0, _rxjs.throwError)(error)))))).toPromise();
};
/**
 * Retries the provided Elasticsearch API call when an error such as
 * `AuthenticationException` `NoConnections`, `ConnectionFault`,
 * `ServiceUnavailable` or `RequestTimeout` are encountered. The API call will
 * be retried once a second, indefinitely, until a successful response or a
 * different error is received.
 *
 * @example
 * ```ts
 * const response = await migrationRetryCallCluster(() => client.ping(), logger);
 * ```
 *
 * @internal
 */


exports.retryCallCluster = retryCallCluster;

const migrationRetryCallCluster = (apiCaller, log, delay = 2500) => {
  const previousErrors = [];
  return (0, _rxjs.defer)(() => apiCaller()).pipe((0, _operators.retryWhen)(errors => errors.pipe((0, _operators.concatMap)(error => {
    if (!previousErrors.includes(error.message)) {
      log.warn(`Unable to connect to Elasticsearch. Error: ${error.message}`);
      previousErrors.push(error.message);
    }

    return (0, _rxjs.iif)(() => {
      var _error$body, _error$body$error;

      return error.name === 'NoLivingConnectionsError' || error.name === 'ConnectionError' || error.name === 'TimeoutError' || error.name === 'ResponseError' && retryResponseStatuses.includes(error.statusCode) || (error === null || error === void 0 ? void 0 : (_error$body = error.body) === null || _error$body === void 0 ? void 0 : (_error$body$error = _error$body.error) === null || _error$body$error === void 0 ? void 0 : _error$body$error.type) === 'snapshot_in_progress_exception';
    }, (0, _rxjs.timer)(delay), (0, _rxjs.throwError)(error));
  })))).toPromise();
};

exports.migrationRetryCallCluster = migrationRetryCallCluster;