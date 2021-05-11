"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callClient = callClient;

var _default_search_strategy = require("./default_search_strategy");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function callClient(searchRequests, requestsOptions = [], fetchHandlers) {
  // Correlate the options with the request that they're associated with
  const requestOptionEntries = searchRequests.map((request, i) => [request, requestsOptions[i]]);
  const requestOptionsMap = new Map(requestOptionEntries);
  const requestResponseMap = new Map();

  const {
    searching,
    abort
  } = _default_search_strategy.defaultSearchStrategy.search({
    searchRequests,
    ...fetchHandlers
  });

  searchRequests.forEach((request, i) => {
    const response = searching.then(results => fetchHandlers.onResponse(request, results[i]));
    const {
      abortSignal = null
    } = requestOptionsMap.get(request) || {};
    if (abortSignal) abortSignal.addEventListener('abort', abort);
    requestResponseMap.set(request, response);
  });
  return searchRequests.map(request => requestResponseMap.get(request));
}