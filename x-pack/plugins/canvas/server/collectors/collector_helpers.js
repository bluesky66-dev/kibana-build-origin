"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectFns = collectFns;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * @param ast: an ast that includes functions to track
 * @param cb: callback to do something with a function that has been found
 */

function isExpression(maybeExpression) {
  return typeof maybeExpression === 'object' && maybeExpression.type === 'expression';
}

function collectFns(ast, cb) {
  if (!isExpression(ast)) return;
  ast.chain.forEach(({
    function: cFunction,
    arguments: cArguments
  }) => {
    cb(cFunction); // recurse the arguments and update the set along the way

    Object.keys(cArguments).forEach(argName => {
      cArguments[argName].forEach(subAst => {
        if (subAst != null) {
          collectFns(subAst, cb);
        }
      });
    });
  });
}