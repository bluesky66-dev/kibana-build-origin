"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distinctUntilChangedWithInitialValue = distinctUntilChangedWithInitialValue;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function distinctUntilChangedWithInitialValue(initialValue, compare) {
  return input$ => (0, _rxjs.scheduled)([isPromise(initialValue) ? (0, _rxjs.from)(initialValue) : [initialValue], input$], _rxjs.queueScheduler).pipe((0, _operators.concatAll)(), (0, _operators.distinctUntilChanged)(compare), (0, _operators.skip)(1));
}

function isPromise(value) {
  return !!value && typeof value === 'object' && 'then' in value && typeof value.then === 'function' && !('subscribe' in value);
}