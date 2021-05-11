"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncMap = asyncMap;
exports.readableEnd = readableEnd;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Iterate an array asynchronously and in parallel
 */

function asyncMap(array, asyncFn) {
  return Promise.all(array.map(asyncFn));
}
/**
 * Wait for a readable stream to end
 */


function readableEnd(stream) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject).on('end', resolve);
  });
}