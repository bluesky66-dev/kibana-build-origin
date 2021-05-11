"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeoutPromiseAfter = timeoutPromiseAfter;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function timeoutPromiseAfter(future, ms, onTimeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(onTimeout()), ms);
    future.then(resolve).catch(reject);
  });
}