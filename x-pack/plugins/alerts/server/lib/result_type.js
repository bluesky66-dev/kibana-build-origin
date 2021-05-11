"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asOk = asOk;
exports.asErr = asErr;
exports.isOk = isOk;
exports.isErr = isErr;
exports.promiseResult = promiseResult;
exports.map = map;
exports.resolveErr = resolveErr;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

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

function map(result, onOk, onErr) {
  return isOk(result) ? onOk(result.value) : onErr(result.error);
}

function resolveErr(result, onErr) {
  return isOk(result) ? result.value : onErr(result.error);
}