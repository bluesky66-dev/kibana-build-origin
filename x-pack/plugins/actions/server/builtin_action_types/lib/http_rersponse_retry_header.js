"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRetryAfterIntervalFromHeaders = getRetryAfterIntervalFromHeaders;

var _Option = require("fp-ts/lib/Option");

var _pipeable = require("fp-ts/lib/pipeable");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getRetryAfterIntervalFromHeaders(headers) {
  return (0, _pipeable.pipe)((0, _Option.fromNullable)(headers['retry-after']), (0, _Option.map)(retryAfter => parseInt(retryAfter, 10)), (0, _Option.filter)(retryAfter => !isNaN(retryAfter)));
}