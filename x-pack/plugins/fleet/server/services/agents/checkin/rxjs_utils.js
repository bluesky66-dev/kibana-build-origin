"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRateLimiter = createRateLimiter;
exports.toPromiseAbortable = exports.AbortError = void 0;

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AbortError extends Error {}

exports.AbortError = AbortError;

const toPromiseAbortable = (observable, signal) => new Promise((resolve, reject) => {
  if (signal && signal.aborted) {
    reject(new AbortError('Aborted'));
    return;
  }

  const listener = () => {
    subscription.unsubscribe();
    reject(new AbortError('Aborted'));
  };

  const cleanup = () => {
    if (signal) {
      signal.removeEventListener('abort', listener);
    }
  };

  const subscription = observable.subscribe(data => {
    cleanup();
    resolve(data);
  }, err => {
    cleanup();
    reject(err);
  });

  if (signal) {
    signal.addEventListener('abort', listener, {
      once: true
    });
  }
});

exports.toPromiseAbortable = toPromiseAbortable;

function createRateLimiter(ratelimitIntervalMs, ratelimitRequestPerInterval, maxDelay, scheduler = Rx.asyncScheduler) {
  let intervalEnd = 0;
  let countInCurrentInterval = 0;

  function createRateLimitOperator() {
    const maxIntervalEnd = scheduler.now() + maxDelay;
    return Rx.pipe((0, _operators.concatMap)(function rateLimit(value) {
      const now = scheduler.now();

      if (intervalEnd <= now) {
        countInCurrentInterval = 1;
        intervalEnd = now + ratelimitIntervalMs;
        return Rx.of(value);
      } else if (intervalEnd >= maxIntervalEnd) {
        // drop the value as it's never going to success as long polling timeout is going to happen before we can send the policy
        return Rx.EMPTY;
      } else {
        if (++countInCurrentInterval > ratelimitRequestPerInterval) {
          countInCurrentInterval = 1;
          intervalEnd += ratelimitIntervalMs;
        }

        const wait = intervalEnd - ratelimitIntervalMs - now;
        return wait > 0 ? Rx.of(value).pipe((0, _operators.delay)(wait, scheduler)) : Rx.of(value);
      }
    }));
  }

  return createRateLimitOperator;
}