"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExpressionAstBuilder = isExpressionAstBuilder;
exports.isExpressionAst = isExpressionAst;
exports.buildExpression = buildExpression;

var _build_function = require("./build_function");

var _format = require("./format");

var _parse = require("./parse");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Type guard that checks whether a given value is an
 * `ExpressionAstExpressionBuilder`. This is useful when working
 * with subexpressions, where you might be retrieving a function
 * argument, and need to know whether it is an expression builder
 * instance which you can perform operations on.
 *
 * @example
 * const arg = myFunction.getArgument('foo');
 * if (isExpressionAstBuilder(foo)) {
 *   foo.toAst();
 * }
 *
 * @param val Value you want to check.
 * @return boolean
 */
function isExpressionAstBuilder(val) {
  return (val === null || val === void 0 ? void 0 : val.type) === 'expression_builder';
}
/** @internal */


function isExpressionAst(val) {
  return (val === null || val === void 0 ? void 0 : val.type) === 'expression';
}

const generateExpressionAst = fns => ({
  type: 'expression',
  chain: fns.map(fn => fn.toAst())
});
/**
 * Makes it easy to progressively build, update, and traverse an
 * expression AST. You can either start with an empty AST, or
 * provide an expression string, AST, or array of expression
 * function builders to use as initial state.
 *
 * @param initialState Optional. An expression string, AST, or array of `ExpressionAstFunctionBuilder[]`.
 * @return `this`
 */


function buildExpression(initialState) {
  const chainToFunctionBuilder = chain => chain.map(fn => (0, _build_function.buildExpressionFunction)(fn.function, fn.arguments)); // Takes `initialState` and converts it to an array of `ExpressionAstFunctionBuilder`


  const extractFunctionsFromState = state => {
    if (typeof state === 'string') {
      return chainToFunctionBuilder((0, _parse.parse)(state, 'expression').chain);
    } else if (!Array.isArray(state)) {
      // If it isn't an array, it is an `ExpressionAstExpression`
      return chainToFunctionBuilder(state.chain);
    }

    return state;
  };

  const fns = initialState ? extractFunctionsFromState(initialState) : [];
  return {
    type: 'expression_builder',
    functions: fns,

    findFunction(fnName) {
      const foundFns = [];
      return fns.reduce((found, currFn) => {
        Object.values(currFn.arguments).forEach(values => {
          values.forEach(value => {
            if (isExpressionAstBuilder(value)) {
              // `value` is a subexpression, recurse and continue searching
              found = found.concat(value.findFunction(fnName));
            }
          });
        });

        if (currFn.name === fnName) {
          found.push(currFn);
        }

        return found;
      }, foundFns);
    },

    toAst() {
      if (fns.length < 1) {
        throw new Error('Functions have not been added to the expression builder');
      }

      return generateExpressionAst(fns);
    },

    toString() {
      if (fns.length < 1) {
        throw new Error('Functions have not been added to the expression builder');
      }

      return (0, _format.format)(generateExpressionAst(fns), 'expression');
    }

  };
}