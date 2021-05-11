"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldNames = getFieldNames;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getFieldNames(names, ast) {
  if (typeof ast === 'number') {
    return names;
  }

  if (ast.type === 'function') {
    return names.concat(ast.args.reduce(getFieldNames, []));
  }

  if (ast.type === 'variable') {
    return names.concat(ast.value);
  }

  return names;
}