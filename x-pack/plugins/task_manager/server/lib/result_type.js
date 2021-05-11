"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asOk = asOk;
exports.asErr = asErr;
exports.isOk = isOk;
exports.isErr = isErr;
exports.tryAsResult = tryAsResult;
exports.promiseResult = promiseResult;
exports.unwrapPromise = unwrapPromise;
exports.unwrap = unwrap;
exports.either = either;
exports.eitherAsync = eitherAsync;
exports.map = map;
exports.mapErr = exports.mapOk = exports.mapR = void 0;

var _lodash = require("lodash");
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

function tryAsResult(fn) {
  try {
    return asOk(fn());
  } catch (e) {
    return asErr(e);
  }
}

async function promiseResult(future) {
  try {
    return asOk(await future);
  } catch (e) {
    return asErr(e);
  }
}

async function unwrapPromise(future) {
  return future.catch( // catch rejection as we expect the result of the rejected promise
  // to be wrapped in a Result - sadly there's no way to "Type" this
  // requirment in Typescript as Promises do not enfore a type on their
  // rejection
  // The `then` will then unwrap the Result from around `ex` for us
  ex => ex).then(result => map(result, value => Promise.resolve(value), err => Promise.reject(err)));
}

function unwrap(result) {
  return isOk(result) ? result.value : result.error;
}

function either(result, onOk, onErr) {
  map(result, onOk, onErr);
  return result;
}

async function eitherAsync(result, onOk, onErr) {
  return await map(result, onOk, onErr);
}

function map(result, onOk, onErr) {
  return isOk(result) ? onOk(result.value) : onErr(result.error);
}

const mapR = (0, _lodash.curry)(function (onOk, onErr, result) {
  return map(result, onOk, onErr);
});
exports.mapR = mapR;
const mapOk = (0, _lodash.curry)(function (onOk, result) {
  return isOk(result) ? onOk(result.value) : result;
});
exports.mapOk = mapOk;
const mapErr = (0, _lodash.curry)(function (onErr, result) {
  return isOk(result) ? result : onErr(result.error);
});
exports.mapErr = mapErr;