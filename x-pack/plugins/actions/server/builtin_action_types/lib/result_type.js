"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asOk = asOk;
exports.asErr = asErr;
exports.isOk = isOk;
exports.isErr = isErr;
exports.promiseResult = promiseResult;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// There appears to be an unexported implementation of Either in here: src/core/server/saved_objects/service/lib/repository.ts
// Which is basically the Haskel equivalent of Rust/ML/Scala's Result
// I'll reach out to other's in Kibana to see if we can merge these into one type

function asOk(value) {
  return {
    tag: 'ok',
    value
  };
}

function asErr(error) {
  return {
    tag: 'err',
    error
  };
}

function isOk(result) {
  return result.tag === 'ok';
}

function isErr(result) {
  return !isOk(result);
}

async function promiseResult(future) {
  try {
    return asOk(await future);
  } catch (e) {
    return asErr(e);
  }
}