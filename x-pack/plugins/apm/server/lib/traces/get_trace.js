"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrace = getTrace;

var _get_trace_items = require("./get_trace_items");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTrace(traceId, setup) {
  const {
    errorsPerTransaction,
    ...trace
  } = await (0, _get_trace_items.getTraceItems)(traceId, setup);
  return {
    trace,
    errorsPerTransaction
  };
}