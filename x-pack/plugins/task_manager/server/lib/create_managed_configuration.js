"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createManagedConfiguration = createManagedConfiguration;
exports.ADJUST_THROUGHPUT_INTERVAL = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FLUSH_MARKER = Symbol('flush');
const ADJUST_THROUGHPUT_INTERVAL = 10 * 1000; // When errors occur, reduce maxWorkers by MAX_WORKERS_DECREASE_PERCENTAGE
// When errors no longer occur, start increasing maxWorkers by MAX_WORKERS_INCREASE_PERCENTAGE
// until starting value is reached

exports.ADJUST_THROUGHPUT_INTERVAL = ADJUST_THROUGHPUT_INTERVAL;
const MAX_WORKERS_DECREASE_PERCENTAGE = 0.8;
const MAX_WORKERS_INCREASE_PERCENTAGE = 1.05; // When errors occur, increase pollInterval by POLL_INTERVAL_INCREASE_PERCENTAGE
// When errors no longer occur, start decreasing pollInterval by POLL_INTERVAL_DECREASE_PERCENTAGE
// until starting value is reached

const POLL_INTERVAL_DECREASE_PERCENTAGE = 0.95;
const POLL_INTERVAL_INCREASE_PERCENTAGE = 1.2;

function createManagedConfiguration({
  logger,
  startingMaxWorkers,
  startingPollInterval,
  errors$
}) {
  const errorCheck$ = countErrors(errors$, ADJUST_THROUGHPUT_INTERVAL);
  return {
    maxWorkersConfiguration$: errorCheck$.pipe(createMaxWorkersScan(logger, startingMaxWorkers), (0, _operators.startWith)(startingMaxWorkers), (0, _operators.distinctUntilChanged)()),
    pollIntervalConfiguration$: errorCheck$.pipe(createPollIntervalScan(logger, startingPollInterval), (0, _operators.startWith)(startingPollInterval), (0, _operators.distinctUntilChanged)())
  };
}

function createMaxWorkersScan(logger, startingMaxWorkers) {
  return (0, _operators.scan)((previousMaxWorkers, errorCount) => {
    let newMaxWorkers;

    if (errorCount > 0) {
      // Decrease max workers by MAX_WORKERS_DECREASE_PERCENTAGE while making sure it doesn't go lower than 1.
      // Using Math.floor to make sure the number is different than previous while not being a decimal value.
      newMaxWorkers = Math.max(Math.floor(previousMaxWorkers * MAX_WORKERS_DECREASE_PERCENTAGE), 1);
    } else {
      // Increase max workers by MAX_WORKERS_INCREASE_PERCENTAGE while making sure it doesn't go
      // higher than the starting value. Using Math.ceil to make sure the number is different than
      // previous while not being a decimal value
      newMaxWorkers = Math.min(startingMaxWorkers, Math.ceil(previousMaxWorkers * MAX_WORKERS_INCREASE_PERCENTAGE));
    }

    if (newMaxWorkers !== previousMaxWorkers) {
      logger.debug(`Max workers configuration changing from ${previousMaxWorkers} to ${newMaxWorkers} after seeing ${errorCount} error(s)`);

      if (previousMaxWorkers === startingMaxWorkers) {
        logger.warn(`Max workers configuration is temporarily reduced after Elasticsearch returned ${errorCount} "too many request" error(s).`);
      }
    }

    return newMaxWorkers;
  }, startingMaxWorkers);
}

function createPollIntervalScan(logger, startingPollInterval) {
  return (0, _operators.scan)((previousPollInterval, errorCount) => {
    let newPollInterval;

    if (errorCount > 0) {
      // Increase poll interval by POLL_INTERVAL_INCREASE_PERCENTAGE and use Math.ceil to
      // make sure the number is different than previous while not being a decimal value.
      newPollInterval = Math.ceil(previousPollInterval * POLL_INTERVAL_INCREASE_PERCENTAGE);
    } else {
      // Decrease poll interval by POLL_INTERVAL_DECREASE_PERCENTAGE and use Math.floor to
      // make sure the number is different than previous while not being a decimal value.
      newPollInterval = Math.max(startingPollInterval, Math.floor(previousPollInterval * POLL_INTERVAL_DECREASE_PERCENTAGE));
    }

    if (newPollInterval !== previousPollInterval) {
      logger.debug(`Poll interval configuration changing from ${previousPollInterval} to ${newPollInterval} after seeing ${errorCount} error(s)`);

      if (previousPollInterval === startingPollInterval) {
        logger.warn(`Poll interval configuration is temporarily increased after Elasticsearch returned ${errorCount} "too many request" error(s).`);
      }
    }

    return newPollInterval;
  }, startingPollInterval);
}

function countErrors(errors$, countInterval) {
  return (0, _rxjs.merge)( // Flush error count at fixed interval
  (0, _rxjs.interval)(countInterval).pipe((0, _operators.map)(() => FLUSH_MARKER)), errors$.pipe((0, _operators.filter)(e => _server.SavedObjectsErrorHelpers.isTooManyRequestsError(e)))).pipe( // When tag is "flush", reset the error counter
  // Otherwise increment the error counter
  (0, _operators.mergeScan)(({
    count
  }, next) => {
    return next === FLUSH_MARKER ? (0, _rxjs.of)(emitErrorCount(count), resetErrorCount()) : (0, _rxjs.of)(incementErrorCount(count));
  }, emitErrorCount(0)), (0, _operators.filter)(isEmitEvent), (0, _operators.map)(({
    count
  }) => count));
}

function emitErrorCount(count) {
  return {
    tag: 'emit',
    count
  };
}

function isEmitEvent(event) {
  return event.tag === 'emit';
}

function incementErrorCount(count) {
  return {
    tag: 'inc',
    count: count + 1
  };
}

function resetErrorCount() {
  return {
    tag: 'initial',
    count: 0
  };
}