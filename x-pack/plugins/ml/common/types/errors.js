"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isErrorResponse = isErrorResponse;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isErrorResponse(arg) {
  var _arg$body, _arg$body2;

  return (arg === null || arg === void 0 ? void 0 : (_arg$body = arg.body) === null || _arg$body === void 0 ? void 0 : _arg$body.error) !== undefined && (arg === null || arg === void 0 ? void 0 : (_arg$body2 = arg.body) === null || _arg$body2 === void 0 ? void 0 : _arg$body2.message) !== undefined;
}