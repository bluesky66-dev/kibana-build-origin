"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeChildProcess = safeChildProcess;

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
// Our process can get sent various signals, and when these occur we wish to
// kill the subprocess and then kill our process as long as the observer isn't cancelled


function safeChildProcess(logger, childProcess) {
  const ownTerminateSignal$ = Rx.merge(Rx.fromEvent(process, 'SIGTERM').pipe((0, _operators.mapTo)('SIGTERM')), Rx.fromEvent(process, 'SIGINT').pipe((0, _operators.mapTo)('SIGINT')), Rx.fromEvent(process, 'SIGBREAK').pipe((0, _operators.mapTo)('SIGBREAK'))).pipe((0, _operators.take)(1), (0, _operators.share)());
  const ownTerminateMapToKill$ = ownTerminateSignal$.pipe((0, _operators.tap)(signal => {
    logger.debug(`Kibana process received terminate signal: ${signal}`);
  }), (0, _operators.mapTo)('SIGKILL'));
  const kibanaForceExit$ = Rx.fromEvent(process, 'exit').pipe((0, _operators.take)(1), (0, _operators.tap)(signal => {
    logger.debug(`Kibana process forcefully exited with signal: ${signal}`);
  }), (0, _operators.mapTo)('SIGKILL'));
  const signalForChildProcess$ = Rx.merge(ownTerminateMapToKill$, kibanaForceExit$);
  const logAndKillChildProcess = (0, _operators.tap)(signal => {
    logger.debug(`Child process terminate signal was: ${signal}. Closing the browser...`);
    return childProcess.kill(signal);
  }); // send termination signals

  const terminate$ = Rx.merge(signalForChildProcess$.pipe(logAndKillChildProcess), ownTerminateSignal$.pipe((0, _operators.delay)(1), (0, _operators.tap)(signal => {
    logger.debug(`Kibana process terminate signal was: ${signal}. Closing the browser...`);
    return process.kill(process.pid, signal);
  })));
  return {
    terminate$
  };
}