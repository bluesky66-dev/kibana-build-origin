"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLimitedRoute = isLimitedRoute;
exports.createLimitedPreAuthHandler = createLimitedPreAuthHandler;
exports.registerLimitedConcurrencyRoutes = registerLimitedConcurrencyRoutes;
exports.MaxCounter = void 0;

var _common = require("../../common");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class MaxCounter {
  constructor(max = 1) {
    this.max = max;

    _defineProperty(this, "counter", 0);
  }

  valueOf() {
    return this.counter;
  }

  increase() {
    if (this.counter < this.max) {
      this.counter += 1;
    }
  }

  decrease() {
    if (this.counter > 0) {
      this.counter -= 1;
    }
  }

  lessThanMax() {
    return this.counter < this.max;
  }

}

exports.MaxCounter = MaxCounter;

function isLimitedRoute(request) {
  const tags = request.route.options.tags;
  return !!tags.includes(_common.LIMITED_CONCURRENCY_ROUTE_TAG);
}

function createLimitedPreAuthHandler({
  isMatch,
  maxCounter
}) {
  return function preAuthHandler(request, response, toolkit) {
    if (!isMatch(request)) {
      return toolkit.next();
    }

    if (!maxCounter.lessThanMax()) {
      return response.customError({
        body: 'Too Many Requests',
        statusCode: 429
      });
    }

    maxCounter.increase();
    request.events.completed$.toPromise().then(() => {
      maxCounter.decrease();
    });
    return toolkit.next();
  };
}

function registerLimitedConcurrencyRoutes(core, config) {
  const max = config.agents.maxConcurrentConnections;
  if (!max) return;
  core.http.registerOnPreAuth(createLimitedPreAuthHandler({
    isMatch: isLimitedRoute,
    maxCounter: new MaxCounter(max)
  }));
}