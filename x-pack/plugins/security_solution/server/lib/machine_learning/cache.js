"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cache = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Caches the result of a function call
 *
 * @param fn the function to be invoked
 *
 * @returns A function that will invoke the given function on its first invocation,
 * and then simply return the result on subsequent calls
 */

const cache = fn => {
  let result = null;
  return () => {
    if (result === null) {
      result = fn();
    }

    return result;
  };
};

exports.cache = cache;