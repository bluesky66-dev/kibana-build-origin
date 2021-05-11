"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../../../src/core/server");

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }

  return value;
}

var _logger = new WeakMap();

var _coreStatus$ = new WeakMap();
/**
 * Service responsible for interactions with the Elasticsearch.
 */


class ElasticsearchService {
  constructor(logger) {
    _logger.set(this, {
      writable: true,
      value: void 0
    });

    _coreStatus$.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _logger, logger);
  }

  setup({
    status,
    license
  }) {
    _classPrivateFieldSet(this, _coreStatus$, (0, _rxjs.combineLatest)([status.core$, license.features$]).pipe((0, _operators.map)(([coreStatus]) => license.isEnabled() && coreStatus.elasticsearch.level === _server.ServiceStatusLevels.available), (0, _operators.shareReplay)(1)));
  }

  start() {
    return {
      // We'll need to get rid of this as soon as Core's Elasticsearch service exposes this
      // functionality in the scope of https://github.com/elastic/kibana/issues/41983.
      watchOnlineStatus$: () => {
        const RETRY_SCALE_DURATION = 100;
        const RETRY_TIMEOUT_MAX = 10000;
        const retries$ = new _rxjs.BehaviorSubject(0);
        const retryScheduler = {
          scheduleRetry: () => {
            const retriesElapsed = retries$.getValue() + 1;
            const nextRetryTimeout = Math.min(retriesElapsed * RETRY_SCALE_DURATION, RETRY_TIMEOUT_MAX);

            _classPrivateFieldGet(this, _logger).debug(`Scheduling re-try in ${nextRetryTimeout} ms.`);

            retryTimeout = setTimeout(() => retries$.next(retriesElapsed), nextRetryTimeout);
          }
        };
        let retryTimeout;
        return (0, _rxjs.combineLatest)([_classPrivateFieldGet(this, _coreStatus$).pipe((0, _operators.tap)(() => {
          // If status or license change occurred before retry timeout we should cancel
          // it and reset retry counter.
          if (retryTimeout) {
            clearTimeout(retryTimeout);
          }

          if (retries$.value > 0) {
            retries$.next(0);
          }
        })), retries$.asObservable().pipe( // We shouldn't emit new value if retry counter is reset. This comparator isn't called for
        // the initial value.
        (0, _operators.distinctUntilChanged)((prev, curr) => prev === curr || curr === 0))]).pipe((0, _operators.filter)(([isAvailable]) => isAvailable), (0, _operators.map)(() => retryScheduler));
      }
    };
  }

}

exports.ElasticsearchService = ElasticsearchService;