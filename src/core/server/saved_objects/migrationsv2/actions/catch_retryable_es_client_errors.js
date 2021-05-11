"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catchRetryableEsClientErrors = void 0;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _elasticsearch = require("@elastic/elasticsearch");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

const catchRetryableEsClientErrors = e => {
  var _e$body, _e$body$error;

  if (e instanceof _elasticsearch.errors.NoLivingConnectionsError || e instanceof _elasticsearch.errors.ConnectionError || e instanceof _elasticsearch.errors.TimeoutError || e instanceof _elasticsearch.errors.ResponseError && (retryResponseStatuses.includes(e.statusCode) || // ES returns a 400 Bad Request when trying to close or delete an
  // index while snapshots are in progress. This should have been a 503
  // so once https://github.com/elastic/elasticsearch/issues/65883 is
  // fixed we can remove this.
  ((_e$body = e.body) === null || _e$body === void 0 ? void 0 : (_e$body$error = _e$body.error) === null || _e$body$error === void 0 ? void 0 : _e$body$error.type) === 'snapshot_in_progress_exception')) {
    return Either.left({
      type: 'retryable_es_client_error',
      message: e.message,
      error: e
    });
  } else {
    throw e;
  }
};

exports.catchRetryableEsClientErrors = catchRetryableEsClientErrors;