"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionWrapper = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Takes a function spec and passes in default args,
 * overriding with any provided args.
 */
const functionWrapper = spec => {
  const defaultArgs = (0, _lodash.mapValues)(spec.args, argSpec => argSpec.default);
  return (context, args = {}, handlers = {}) => spec.fn(context, { ...defaultArgs,
    ...args
  }, handlers);
};

exports.functionWrapper = functionWrapper;