"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormObject = getFormObject;

var _tinymath = require("@kbn/tinymath");

var _unquote_string = require("../../../../common/lib/unquote_string");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// break out into separate function, write unit tests first


function getFormObject(argValue) {
  if (argValue === '') {
    return {
      fn: '',
      column: ''
    };
  } // check if the value is a math expression, and set its type if it is


  const mathObj = (0, _tinymath.parse)(argValue); // A symbol node is a plain string, so we guess that they're looking for a column.

  if (typeof mathObj === 'number') {
    throw new Error(`Cannot render scalar values or complex math expressions`);
  }

  if (mathObj.type === 'variable') {
    return {
      fn: '',
      column: (0, _unquote_string.unquoteString)(mathObj.value)
    };
  } // Check if its a simple function, eg a function wrapping a symbol node
  // check for only one arg of type string


  if (mathObj.type === 'function' && mathObj.args.length === 1 && typeof mathObj.args[0] !== 'number' && mathObj.args[0].type === 'variable') {
    return {
      fn: mathObj.name,
      column: (0, _unquote_string.unquoteString)(mathObj.args[0].value)
    };
  } // Screw it, textarea for you my fancy.


  throw new Error(`Cannot render scalar values or complex math expressions`);
}