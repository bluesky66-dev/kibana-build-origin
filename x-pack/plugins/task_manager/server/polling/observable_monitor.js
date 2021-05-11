"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createObservableMonitor = createObservableMonitor;

var _rxjs = require("rxjs");

var _lodash = require("lodash");

var _operators = require("rxjs/operators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_HEARTBEAT_INTERVAL = 1000; // by default don't monitor inactivity as not all observables are expected
// to emit at any kind of fixed interval

const DEFAULT_INACTIVITY_TIMEOUT = 0;

function createObservableMonitor(observableFactory, {
  heartbeatInterval = DEFAULT_HEARTBEAT_INTERVAL,
  inactivityTimeout = DEFAULT_INACTIVITY_TIMEOUT,
  onError = _lodash.noop
} = {}) {
  return new _rxjs.Observable(subscriber => {
    const subscription = (0, _rxjs.timer)(0, heartbeatInterval).pipe( // switch from the heartbeat interval to the instantiated observable until it completes / errors
    (0, _operators.exhaustMap)(() => takeUntilDurationOfInactivity(observableFactory(), inactivityTimeout)), // if an error is thrown, catch it, notify and try to recover
    (0, _operators.catchError)((err, source$) => {
      onError(err); // return source, which will allow our observable to recover from this error and
      // keep pulling values out of it

      return source$;
    })).subscribe(subscriber);
    return () => {
      subscription.unsubscribe();
    };
  });
}

function takeUntilDurationOfInactivity(source$, inactivityTimeout) {
  // if there's a specified maximum duration of inactivity, only take values until that
  // duration elapses without any new events
  if (inactivityTimeout) {
    // an observable which starts a timer every time a new value is passed in, replacing the previous timer
    // if the timer goes off without having been reset by a fresh value, it will emit a single event - which will
    // notify our monitor that the source has been inactive for too long
    const inactivityMonitor$ = new _rxjs.Subject();
    return source$.pipe((0, _operators.takeUntil)(inactivityMonitor$.pipe( // on each new emited value, start a new timer, discarding the old one
    (0, _operators.switchMap)(() => (0, _rxjs.timer)(inactivityTimeout)), // every time a timer expires (meaning no new value came in on time to discard it)
    // throw an error, forcing the monitor instantiate a new observable
    (0, _operators.switchMapTo)((0, _rxjs.throwError)(new Error(`Observable Monitor: Hung Observable restarted after ${inactivityTimeout}ms of inactivity`))))), // poke `inactivityMonitor$` so it restarts the timer
    (0, _operators.tap)(() => inactivityMonitor$.next()));
  }

  return source$;
}