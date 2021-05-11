"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShardTimeout = getShardTimeout;
exports.getDefaultSearchParams = getDefaultSearchParams;
exports.shimAbortSignal = void 0;

var _common = require("../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getShardTimeout(config) {
  const timeout = config.elasticsearch.shardTimeout.asMilliseconds();
  return timeout ? {
    timeout: `${timeout}ms`
  } : {};
}

async function getDefaultSearchParams(uiSettingsClient) {
  const maxConcurrentShardRequests = await uiSettingsClient.get(_common.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS);
  return {
    max_concurrent_shard_requests: maxConcurrentShardRequests > 0 ? maxConcurrentShardRequests : undefined,
    ignore_unavailable: true,
    // Don't fail if the index/indices don't exist
    track_total_hits: true
  };
}
/**
 * Temporary workaround until https://github.com/elastic/elasticsearch-js/issues/1297 is resolved.
 * Shims the `AbortSignal` behavior so that, if the given `signal` aborts, the `abort` method on the
 * `TransportRequestPromise` is called, actually performing the cancellation.
 * @internal
 */


const shimAbortSignal = (promise, signal) => {
  if (!signal) return promise;

  const abortHandler = () => {
    promise.abort();
    cleanup();
  };

  const cleanup = () => signal.removeEventListener('abort', abortHandler);

  if (signal.aborted) {
    promise.abort();
  } else {
    signal.addEventListener('abort', abortHandler);
    promise.then(cleanup, cleanup);
  }

  return promise;
};

exports.shimAbortSignal = shimAbortSignal;