"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abortSignalToPromise = abortSignalToPromise;
exports.getCombinedAbortSignal = getCombinedAbortSignal;
exports.AbortError = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Class used to signify that something was aborted. Useful for applications to conditionally handle
 * this type of error differently than other errors.
 */
class AbortError extends Error {
  constructor(message = 'Aborted') {
    super(message);
    this.message = message;
    this.name = 'AbortError';
  }

}
/**
 * Returns a `Promise` corresponding with when the given `AbortSignal` is aborted. Useful for
 * situations when you might need to `Promise.race` multiple `AbortSignal`s, or an `AbortSignal`
 * with any other expected errors (or completions).
 *
 * @param signal The `AbortSignal` to generate the `Promise` from
 */


exports.AbortError = AbortError;

function abortSignalToPromise(signal) {
  let abortHandler;

  const cleanup = () => {
    if (abortHandler) {
      signal.removeEventListener('abort', abortHandler);
    }
  };

  const promise = new Promise((resolve, reject) => {
    if (signal.aborted) reject(new AbortError());

    abortHandler = () => {
      cleanup();
      reject(new AbortError());
    };

    signal.addEventListener('abort', abortHandler);
  });
  return {
    promise,
    cleanup
  };
}
/**
 * Returns an `AbortSignal` that will be aborted when the first of the given signals aborts.
 *
 * @param signals
 */


function getCombinedAbortSignal(signals) {
  const controller = new AbortController();

  let cleanup = () => {};

  if (signals.some(signal => signal.aborted)) {
    controller.abort();
  } else {
    const promises = signals.map(signal => abortSignalToPromise(signal));

    cleanup = () => {
      promises.forEach(p => p.cleanup());
      controller.signal.removeEventListener('abort', cleanup);
    };

    controller.signal.addEventListener('abort', cleanup);
    Promise.race(promises.map(p => p.promise)).catch(() => {
      cleanup();
      controller.abort();
    });
  }

  return {
    signal: controller.signal,
    cleanup
  };
}