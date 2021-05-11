"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvable = resolvable;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates a promise which can be resolved externally, useful for
 * coordinating async tests.
 */

function resolvable() {
  let resolve;
  return Object.assign(new Promise(r => resolve = r), {
    resolve(arg) {
      return setTimeout(() => resolve(arg), 0);
    }

  });
}