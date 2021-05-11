"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTaskPoller = createTaskPoller;
exports.PollingError = exports.PollingErrorType = void 0;

var _perf_hooks = require("perf_hooks");

var _lodash = require("lodash");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _pipeable = require("fp-ts/lib/pipeable");

var _Option = require("fp-ts/lib/Option");

var _pull_from_set = require("../lib/pull_from_set");

var _result_type = require("../lib/result_type");

var _timeout_promise_after = require("./timeout_promise_after");

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
/**
 * constructs a new TaskPoller stream, which emits events on demand and on a scheduled interval, waiting for capacity to be available before emitting more events.
 *
 * @param opts
 * @prop {number} pollInterval - How often, in milliseconds, we will an event be emnitted, assuming there's capacity to do so
 * @prop {() => number} getCapacity - A function specifying whether there is capacity to emit new events
 * @prop {Observable<Option<T>>} pollRequests$ - A stream of requests for polling which can provide an optional argument for the polling phase
 * @prop {number} bufferCapacity - How many requests are do we allow our buffer to accumulate before rejecting requests?
 * @prop {(...params: T[]) => Promise<H>} work - The work we wish to execute in order to `poll`, this is the operation we're actually executing on request
 *
 * @returns {Observable<Set<T>>} - An observable which emits an event whenever a polling event is due to take place, providing access to a singleton Set representing a queue
 *  of unique request argumets of type T. The queue holds all the buffered request arguments streamed in via pollRequests$
 */


function createTaskPoller({
  logger,
  pollInterval$,
  pollIntervalDelay$,
  getCapacity,
  pollRequests$,
  bufferCapacity,
  work,
  workTimeout
}) {
  const hasCapacity = () => getCapacity() > 0;

  const errors$ = new _rxjs.Subject();
  const requestWorkProcessing$ = (0, _rxjs.merge)( // emit a polling event on demand
  pollRequests$, // emit a polling event on a fixed interval
  (0, _rxjs.combineLatest)([pollInterval$.pipe((0, _operators.tap)(period => {
    logger.debug(`Task poller now using interval of ${period}ms`);
  })), pollIntervalDelay$.pipe((0, _operators.tap)(pollDelay => {
    logger.debug(`Task poller now delaying emission by ${pollDelay}ms`);
  }))]).pipe( // We don't have control over `pollDelay` in the poller, and a change to `delayOnClaimConflicts` could accidentally cause us to pause Task Manager
  // polling for a far longer duration that we intended.
  // Since the goal is to shift it within the range of `period`, we use modulo as a safe guard to ensure this doesn't happen.
  (0, _operators.switchMap)(([period, pollDelay]) => (0, _rxjs.timer)(period + pollDelay % period, period)), (0, _operators.mapTo)(_Option.none))).pipe( // buffer all requests in a single set (to remove duplicates) as we don't want
  // work to take place in parallel (it could cause Task Manager to pull in the same
  // task twice)
  (0, _operators.scan)((queue, request) => {
    if ((0, _result_type.isErr)(pushOptionalIntoSet(queue, bufferCapacity, request))) {
      // value wasnt pushed into buffer, we must be at capacity
      errors$.next(asPollingError(`request capacity reached`, PollingErrorType.RequestCapacityReached, request));
    }

    return queue;
  }, new Set()), // only emit polling events when there's capacity to handle them
  (0, _operators.filter)(hasCapacity), // take as many argumented calls as we have capacity for and call `work` with
  // those arguments. If the queue is empty this will still trigger work to be done
  (0, _operators.concatMap)(async set => {
    closeSleepPerf();
    return (0, _result_type.map)(await (0, _result_type.promiseResult)((0, _timeout_promise_after.timeoutPromiseAfter)(work(...(0, _pull_from_set.pullFromSet)(set, getCapacity())), workTimeout, () => new Error(`work has timed out`))), workResult => (0, _result_type.asOk)(workResult), err => asPollingError(err, PollingErrorType.WorkError));
  }), (0, _operators.tap)(openSleepPerf), // catch errors during polling for work
  (0, _operators.catchError)(err => (0, _rxjs.of)(asPollingError(err, PollingErrorType.WorkError))));
  return (0, _rxjs.merge)(requestWorkProcessing$, errors$);
}
/**
 * Unwraps optional values and pushes them into a set
 * @param set A Set of generic type T
 * @param maxCapacity How many values are we allowed to push into the set
 * @param value An optional T to push into the set if it is there
 */


function pushOptionalIntoSet(set, maxCapacity, value) {
  return (0, _pipeable.pipe)(value, (0, _Option.map)(req => {
    if (set.size >= maxCapacity) {
      return (0, _result_type.asErr)(set);
    }

    set.add(req);
    return (0, _result_type.asOk)(set);
  }), (0, _Option.getOrElse)(() => (0, _result_type.asOk)(set)));
}

let PollingErrorType;
exports.PollingErrorType = PollingErrorType;

(function (PollingErrorType) {
  PollingErrorType[PollingErrorType["WorkError"] = 0] = "WorkError";
  PollingErrorType[PollingErrorType["WorkTimeout"] = 1] = "WorkTimeout";
  PollingErrorType[PollingErrorType["RequestCapacityReached"] = 2] = "RequestCapacityReached";
})(PollingErrorType || (exports.PollingErrorType = PollingErrorType = {}));

function asPollingError(err, type, data = _Option.none) {
  return (0, _result_type.asErr)(new PollingError(`Failed to poll for work: ${err}`, type, data));
}

class PollingError extends Error {
  constructor(message, type, data) {
    super(message);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "data", void 0);

    Object.setPrototypeOf(this, new.target.prototype);
    this.type = type;
    this.data = data;
  }

}

exports.PollingError = PollingError;

const openSleepPerf = () => {
  _perf_hooks.performance.mark('TaskPoller.sleep');
}; // we only want to close after an open has been called, as we're counting the time *between* work cycles
// so we'll ignore the first call to `closeSleepPerf` but we will run every subsequent call


const closeSleepPerf = (0, _lodash.after)(2, () => {
  _perf_hooks.performance.mark('TaskPoller.poll');

  _perf_hooks.performance.measure('TaskPoller.sleepDuration', 'TaskPoller.sleep', 'TaskPoller.poll');
});