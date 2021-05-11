"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalLoaded = getTotalLoaded;
exports.toKibanaSearchResponse = toKibanaSearchResponse;
exports.shimHitsTotal = shimHitsTotal;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Get the `total`/`loaded` for this response (see `IKibanaSearchResponse`). Note that `skipped` is
 * not included as it is already included in `successful`.
 * @internal
 */
function getTotalLoaded(response) {
  const {
    total,
    failed,
    successful
  } = response._shards;
  const loaded = failed + successful;
  return {
    total,
    loaded
  };
}
/**
 * Get the Kibana representation of this response (see `IKibanaSearchResponse`).
 * @internal
 */


function toKibanaSearchResponse(rawResponse) {
  return {
    rawResponse,
    isPartial: false,
    isRunning: false,
    ...getTotalLoaded(rawResponse)
  };
}
/**
 * Temporary workaround until https://github.com/elastic/kibana/issues/26356 is addressed.
 * Since we are setting `track_total_hits` in the request, `hits.total` will be an object
 * containing the `value`.
 *
 * @internal
 */


function shimHitsTotal(response, {
  legacyHitsTotal = true
} = {}) {
  var _value, _response$hits, _response$hits$total, _response$hits2;

  if (!legacyHitsTotal) return response;
  const total = (_value = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : (_response$hits$total = _response$hits.total) === null || _response$hits$total === void 0 ? void 0 : _response$hits$total.value) !== null && _value !== void 0 ? _value : (_response$hits2 = response.hits) === null || _response$hits2 === void 0 ? void 0 : _response$hits2.total;
  const hits = { ...response.hits,
    total
  };
  return { ...response,
    hits
  };
}