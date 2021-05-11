"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asHttpRequestExecutionSource = asHttpRequestExecutionSource;
exports.asSavedObjectExecutionSource = asSavedObjectExecutionSource;
exports.isHttpRequestExecutionSource = isHttpRequestExecutionSource;
exports.isSavedObjectExecutionSource = isSavedObjectExecutionSource;
exports.ActionExecutionSourceType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let ActionExecutionSourceType;
exports.ActionExecutionSourceType = ActionExecutionSourceType;

(function (ActionExecutionSourceType) {
  ActionExecutionSourceType["SAVED_OBJECT"] = "SAVED_OBJECT";
  ActionExecutionSourceType["HTTP_REQUEST"] = "HTTP_REQUEST";
})(ActionExecutionSourceType || (exports.ActionExecutionSourceType = ActionExecutionSourceType = {}));

function asHttpRequestExecutionSource(source) {
  return {
    type: ActionExecutionSourceType.HTTP_REQUEST,
    source
  };
}

function asSavedObjectExecutionSource(source) {
  return {
    type: ActionExecutionSourceType.SAVED_OBJECT,
    source
  };
}

function isHttpRequestExecutionSource(executionSource) {
  return (executionSource === null || executionSource === void 0 ? void 0 : executionSource.type) === ActionExecutionSourceType.HTTP_REQUEST;
}

function isSavedObjectExecutionSource(executionSource) {
  return (executionSource === null || executionSource === void 0 ? void 0 : executionSource.type) === ActionExecutionSourceType.SAVED_OBJECT;
}