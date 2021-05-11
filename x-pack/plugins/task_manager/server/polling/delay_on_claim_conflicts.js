"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delayOnClaimConflicts = delayOnClaimConflicts;

var _statsLite = _interopRequireDefault(require("stats-lite"));

var _lodash = require("lodash");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _Option = require("fp-ts/lib/Option");

var _result_type = require("../lib/result_type");

var _task_events = require("../task_events");

var _task_run_calcultors = require("../monitoring/task_run_calcultors");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * This module contains the logic for polling the task manager index for new work.
 */

/**
 * Emits a delay amount in ms to apply to polling whenever the task store exceeds a threshold of claim claimClashes
 */


function delayOnClaimConflicts(maxWorkersConfiguration$, pollIntervalConfiguration$, taskLifecycleEvents$, claimClashesPercentageThreshold, runningAverageWindowSize) {
  const claimConflictQueue = (0, _task_run_calcultors.createRunningAveragedStat)(runningAverageWindowSize); // return a subject to allow multicast and replay the last value to new subscribers

  const multiCastDelays$ = new _rxjs.ReplaySubject(1);
  (0, _rxjs.merge)((0, _rxjs.of)(0), (0, _rxjs.combineLatest)([maxWorkersConfiguration$, pollIntervalConfiguration$, taskLifecycleEvents$.pipe((0, _operators.map)(taskEvent => {
    var _taskEvent$event$valu;

    return (0, _task_events.isTaskPollingCycleEvent)(taskEvent) && (0, _result_type.isOk)(taskEvent.event) && (0, _lodash.isNumber)((_taskEvent$event$valu = taskEvent.event.value.stats) === null || _taskEvent$event$valu === void 0 ? void 0 : _taskEvent$event$valu.tasksConflicted) ? (0, _Option.some)(taskEvent.event.value.stats.tasksConflicted) : _Option.none;
  }), (0, _operators.filter)(claimClashes => (0, _Option.isSome)(claimClashes)), (0, _operators.map)(claimClashes => claimClashes.value))]).pipe((0, _operators.map)(([maxWorkers, pollInterval, latestClaimConflicts]) => {
    // add latest claimConflict count to queue
    claimConflictQueue(latestClaimConflicts);
    const emitWhenExceeds = claimClashesPercentageThreshold * maxWorkers / 100;

    if ( // avoid calculating average if the new value isn't above the Threshold
    latestClaimConflicts >= emitWhenExceeds && // only calculate average and emit value if above or equal to Threshold
    _statsLite.default.percentile(claimConflictQueue(), 0.5) >= emitWhenExceeds) {
      return (0, _Option.some)(pollInterval);
    }

    return _Option.none;
  }), (0, _operators.filter)(pollInterval => (0, _Option.isSome)(pollInterval)), (0, _operators.map)(maybePollInterval => {
    const pollInterval = maybePollInterval.value;
    return (0, _lodash.random)(pollInterval * 0.25, pollInterval * 0.75, false);
  }))).subscribe(delay => {
    multiCastDelays$.next(delay);
  });
  return multiCastDelays$;
}