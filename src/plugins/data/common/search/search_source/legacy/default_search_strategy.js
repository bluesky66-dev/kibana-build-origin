"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultSearchStrategy = void 0;

var _fetch = require("../fetch");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @deprecated
const defaultSearchStrategy = {
  id: 'default',
  search: params => {
    return msearch(params);
  }
};
exports.defaultSearchStrategy = defaultSearchStrategy;

function msearch({
  searchRequests,
  getConfig,
  legacy
}) {
  const {
    callMsearch,
    loadingCount$
  } = legacy;
  const requests = searchRequests.map(({
    index,
    body
  }) => {
    return {
      header: {
        index: index.title || index,
        preference: (0, _fetch.getPreference)(getConfig)
      },
      body
    };
  });
  const abortController = new AbortController();
  let resolved = false; // Start LoadingIndicator

  loadingCount$.next(loadingCount$.getValue() + 1);

  const cleanup = () => {
    if (!resolved) {
      resolved = true; // Decrement loading counter & cleanup BehaviorSubject

      loadingCount$.next(loadingCount$.getValue() - 1);
      loadingCount$.complete();
    }
  };

  const searching = callMsearch({
    body: {
      searches: requests
    },
    signal: abortController.signal
  }).then(res => {
    var _res$body;

    return res === null || res === void 0 ? void 0 : (_res$body = res.body) === null || _res$body === void 0 ? void 0 : _res$body.responses;
  }).finally(() => cleanup());
  return {
    abort: () => {
      abortController.abort();
      cleanup();
    },
    searching
  };
}