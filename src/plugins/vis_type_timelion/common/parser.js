"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTimelionExpression = void 0;

var _chain = require("./_generated_/chain");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-ignore
const parseTimelionExpression = input => (0, _chain.parse)(input);

exports.parseTimelionExpression = parseTimelionExpression;