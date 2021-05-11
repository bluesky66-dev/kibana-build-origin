"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awaitIfPending = awaitIfPending;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// the promise which tracks the setup

let status;
let isPending = false; // default resolve to guard against "undefined is not a function" errors

let onResolve = value => {};

let onReject = reason => {};

async function awaitIfPending(asyncFunction) {
  // pending successful or failed attempt
  if (isPending) {
    // don't run concurrent installs
    // return a promise which will eventually resolve/reject
    return status;
  } else {
    // create the initial promise
    status = new Promise((res, rej) => {
      isPending = true;
      onResolve = res;
      onReject = rej;
    });
  }

  try {
    const result = await asyncFunction().catch(onReject);
    onResolve(result);
  } catch (error) {
    // if something fails
    onReject(error);
  }

  isPending = false;
  return status;
}