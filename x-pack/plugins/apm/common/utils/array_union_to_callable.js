"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayUnionToCallable = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// work around a TypeScript limitation described in https://stackoverflow.com/posts/49511416

const arrayUnionToCallable = array => {
  return array;
};

exports.arrayUnionToCallable = arrayUnionToCallable;