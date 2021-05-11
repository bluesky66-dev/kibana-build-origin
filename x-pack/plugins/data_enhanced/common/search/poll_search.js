"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pollSearch = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _common = require("../../../../../src/plugins/data/common");

var _common2 = require("../../../../../src/plugins/kibana_utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pollSearch = (search, cancel, {
  pollInterval = 1000,
  abortSignal
} = {}) => {
  return (0, _rxjs.defer)(() => {
    if (abortSignal !== null && abortSignal !== void 0 && abortSignal.aborted) {
      throw new _common2.AbortError();
    }

    if (cancel) {
      abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener('abort', cancel, {
        once: true
      });
    }

    const aborted$ = (abortSignal ? (0, _rxjs.fromEvent)(abortSignal, 'abort') : _rxjs.EMPTY).pipe((0, _operators.map)(() => {
      throw new _common2.AbortError();
    }));
    return (0, _rxjs.from)(search()).pipe((0, _operators.expand)(() => (0, _rxjs.timer)(pollInterval).pipe((0, _operators.switchMap)(search))), (0, _operators.tap)(response => {
      if ((0, _common.isErrorResponse)(response)) {
        throw response ? new Error('Received partial response') : new _common2.AbortError();
      }
    }), (0, _operators.takeWhile)(_common.isPartialResponse, true), (0, _operators.takeUntil)(aborted$));
  });
};

exports.pollSearch = pollSearch;