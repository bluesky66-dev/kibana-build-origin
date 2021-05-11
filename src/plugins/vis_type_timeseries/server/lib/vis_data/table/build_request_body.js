"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRequestBody = buildRequestBody;

var _build_processor_function = require("../build_processor_function");

var _table = require("../request_processors/table");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function buildRequestBody(...args) {
  const processor = (0, _build_processor_function.buildProcessorFunction)(_table.processors, ...args);
  const doc = await processor({});
  return doc;
}