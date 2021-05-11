"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCamelCase = isCamelCase;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const camelCaseRegExp = /^[a-z]{1}([a-zA-Z0-9]{1,})$/;

function isCamelCase(candidate) {
  return camelCaseRegExp.test(candidate);
}