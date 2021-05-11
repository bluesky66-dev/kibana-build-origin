"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReadySignal = createReadySignal;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createReadySignal() {
  let resolver;
  const promise = new Promise(resolve => {
    resolver = resolve;
  });

  async function wait() {
    return await promise;
  }

  function signal(value) {
    resolver(value);
  }

  return {
    wait,
    signal
  };
}