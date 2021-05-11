"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isColumnReference = isColumnReference;

var _tinymath = require("@kbn/tinymath");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isColumnReference(mathExpression) {
  if (mathExpression == null) {
    mathExpression = 'null';
  }

  const parsedMath = (0, _tinymath.parse)(mathExpression);
  return typeof parsedMath !== 'number' && parsedMath.type === 'variable';
}