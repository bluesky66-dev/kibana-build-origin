"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRequestAbortedSignal = getRequestAbortedSignal;

var _cjsPonyfill = require("abortcontroller-polyfill/dist/cjs-ponyfill");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-ignore not typed

/**
 * A simple utility function that returns an `AbortSignal` corresponding to an `AbortController`
 * which aborts when the given request is aborted.
 * @param aborted$ The observable of abort events (usually `request.events.aborted$`)
 */
function getRequestAbortedSignal(aborted$) {
  const controller = new _cjsPonyfill.AbortController();
  aborted$.subscribe(() => controller.abort());
  return controller.signal;
}