"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  parse: parseRaw
} = require('@kbn/interpreter/common');

function parse(expression, startRule) {
  try {
    return parseRaw(String(expression), {
      startRule
    });
  } catch (e) {
    throw new Error(`Unable to parse expression: ${e.message}`);
  }
}