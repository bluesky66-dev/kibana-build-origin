"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatExpression = formatExpression;

var _format = require("./format");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Given expression pipeline AST, returns formatted string.
 *
 * @param ast Expression pipeline AST.
 */
function formatExpression(ast) {
  return (0, _format.format)(ast, 'expression');
}