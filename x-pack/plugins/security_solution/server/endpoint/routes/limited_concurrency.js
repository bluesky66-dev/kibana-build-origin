"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLimitedConcurrencyRoutes = registerLimitedConcurrencyRoutes;

var _constants = require("../../../common/endpoint/constants");

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

function shouldHandleRequest(request) {
  const tags = request.route.options.tags;
  return tags.includes(_constants.LIMITED_CONCURRENCY_ENDPOINT_ROUTE_TAG);
}

function registerLimitedConcurrencyRoutes(core) {
  const counter = new MaxCounter(_constants.LIMITED_CONCURRENCY_ENDPOINT_COUNT);
  core.http.registerOnPreAuth(function preAuthHandler(request, response, toolkit) {
    if (!shouldHandleRequest(request)) {
      return toolkit.next();
    }

    if (!counter.lessThanMax()) {
      return response.customError({
        body: 'Too Many Requests',
        statusCode: 429
      });
    }

    counter.increase(); // requests.events.aborted$ has a bug (but has test which explicitly verifies) where it's fired even when the request completes
    // https://github.com/elastic/kibana/pull/70495#issuecomment-656288766

    request.events.aborted$.toPromise().then(() => {
      counter.decrease();
    });
    return toolkit.next();
  });
}