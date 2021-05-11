"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSoon = fetchSoon;

var _constants = require("../../../constants");

var _call_client = require("./call_client");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * This function introduces a slight delay in the request process to allow multiple requests to queue
 * up (e.g. when a dashboard is loading).
 */
async function fetchSoon(request, options, fetchHandlers) {
  const msToDelay = fetchHandlers.getConfig(_constants.UI_SETTINGS.COURIER_BATCH_SEARCHES) ? 50 : 0;
  return delayedFetch(request, options, fetchHandlers, msToDelay);
}
/**
 * Delays executing a function for a given amount of time, and returns a promise that resolves
 * with the result.
 * @param fn The function to invoke
 * @param ms The number of milliseconds to wait
 * @return Promise<any> A promise that resolves with the result of executing the function
 */


function delay(fn, ms) {
  return new Promise(resolve => {
    setTimeout(() => resolve(fn()), ms);
  });
} // The current batch/queue of requests to fetch


let requestsToFetch = [];
let requestOptions = []; // The in-progress fetch (if there is one)

let fetchInProgress = null;
/**
 * Delay fetching for a given amount of time, while batching up the requests to be fetched.
 * Returns a promise that resolves with the response for the given request.
 * @param request The request to fetch
 * @param ms The number of milliseconds to wait (and batch requests)
 * @return Promise<SearchResponse> The response for the given request
 */

async function delayedFetch(request, options, fetchHandlers, ms) {
  if (ms === 0) {
    return (0, _call_client.callClient)([request], [options], fetchHandlers)[0];
  }

  const i = requestsToFetch.length;
  requestsToFetch = [...requestsToFetch, request];
  requestOptions = [...requestOptions, options]; // Note: the typescript here only worked because `SearchResponse` was `any`
  // Since this code is legacy, I'm leaving the any here.

  const responses = await (fetchInProgress = fetchInProgress || delay(() => {
    const response = (0, _call_client.callClient)(requestsToFetch, requestOptions, fetchHandlers);
    requestsToFetch = [];
    requestOptions = [];
    fetchInProgress = null;
    return response;
  }, ms));
  return responses[i];
}