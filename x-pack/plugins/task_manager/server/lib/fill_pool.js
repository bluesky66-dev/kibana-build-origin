"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillPool = fillPool;
exports.FillPoolResult = void 0;

var _perf_hooks = require("perf_hooks");

var _operators = require("rxjs/operators");

var _task_events = require("../task_events");

var _task_pool = require("../task_pool");

var _result_type = require("./result_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let FillPoolResult;
exports.FillPoolResult = FillPoolResult;

(function (FillPoolResult) {
  FillPoolResult["Failed"] = "Failed";
  FillPoolResult["NoAvailableWorkers"] = "NoAvailableWorkers";
  FillPoolResult["NoTasksClaimed"] = "NoTasksClaimed";
  FillPoolResult["RunningAtCapacity"] = "RunningAtCapacity";
  FillPoolResult["RanOutOfCapacity"] = "RanOutOfCapacity";
  FillPoolResult["PoolFilled"] = "PoolFilled";
})(FillPoolResult || (exports.FillPoolResult = FillPoolResult = {}));
/**
 * Given a function that runs a batch of tasks (e.g. taskPool.run), a function
 * that fetches task records (e.g. store.fetchAvailableTasks), and a function
 * that converts task records to the appropriate task runner, this function
 * fills the pool with work.
 *
 * This is annoyingly general in order to simplify testing.
 *
 * @param run - a function that runs a batch of tasks (e.g. taskPool.run)
 * @param fetchAvailableTasks - a function that fetches task records (e.g. store.fetchAvailableTasks)
 * @param converter - a function that converts task records to the appropriate task runner
 */


async function fillPool(fetchAvailableTasks, converter, run) {
  _perf_hooks.performance.mark('fillPool.start');

  return new Promise((resolve, reject) => {
    const stopTaskTimer = (0, _task_events.startTaskTimer)();

    const augmentTimingTo = (result, stats) => ({
      result,
      stats,
      timing: stopTaskTimer()
    });

    fetchAvailableTasks().pipe( // each ClaimOwnershipResult will be sequencially consumed an ran using the `run` handler
    (0, _operators.concatMap)(async res => (0, _result_type.map)(res, async ({
      docs,
      stats
    }) => {
      if (!docs.length) {
        _perf_hooks.performance.mark('fillPool.bailNoTasks');

        _perf_hooks.performance.measure('fillPool.activityDurationUntilNoTasks', 'fillPool.start', 'fillPool.bailNoTasks');

        return (0, _result_type.asOk)({
          result: _task_pool.TaskPoolRunResult.NoTaskWereRan,
          stats
        });
      }

      return (0, _result_type.asOk)(await run(docs.map(converter)).then(runResult => ({
        result: runResult,
        stats
      })));
    }, async fillPoolResult => (0, _result_type.asErr)({
      result: fillPoolResult
    }))), // when the final call to `run` completes, we'll complete the stream and emit the
    // final accumulated result
    (0, _operators.last)()).subscribe(claimResults => {
      resolve((0, _result_type.map)(claimResults, ({
        result,
        stats
      }) => {
        switch (result) {
          case _task_pool.TaskPoolRunResult.RanOutOfCapacity:
            _perf_hooks.performance.mark('fillPool.bailExhaustedCapacity');

            _perf_hooks.performance.measure('fillPool.activityDurationUntilExhaustedCapacity', 'fillPool.start', 'fillPool.bailExhaustedCapacity');

            return augmentTimingTo(FillPoolResult.RanOutOfCapacity, stats);

          case _task_pool.TaskPoolRunResult.RunningAtCapacity:
            _perf_hooks.performance.mark('fillPool.cycle');

            return augmentTimingTo(FillPoolResult.RunningAtCapacity, stats);

          case _task_pool.TaskPoolRunResult.NoTaskWereRan:
            return augmentTimingTo(FillPoolResult.NoTasksClaimed, stats);

          default:
            _perf_hooks.performance.mark('fillPool.cycle');

            return augmentTimingTo(FillPoolResult.PoolFilled, stats);
        }
      }, ({
        result,
        stats
      }) => augmentTimingTo(result, stats)));
    }, err => reject(err));
  });
}