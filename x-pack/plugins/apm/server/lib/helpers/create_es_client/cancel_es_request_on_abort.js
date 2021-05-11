"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelEsRequestOnAbort = cancelEsRequestOnAbort;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function cancelEsRequestOnAbort(promise, request) {
  const subscription = request.events.aborted$.subscribe(() => {
    promise.abort();
  }); // using .catch() here means unsubscribe will be called
  // after it has thrown an error, so we use .then(onSuccess, onFailure)
  // syntax

  promise.then(() => subscription.unsubscribe(), () => subscription.unsubscribe());
  return promise;
}