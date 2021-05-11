"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUnitTestExecutor = void 0;

var _executor = require("../executor");

var _expression_functions = require("./expression_functions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createUnitTestExecutor = () => {
  const executor = _executor.Executor.createWithDefaults();

  for (const func of _expression_functions.functionTestSpecs) {
    executor.registerFunction(func);
  }

  return executor;
};

exports.createUnitTestExecutor = createUnitTestExecutor;