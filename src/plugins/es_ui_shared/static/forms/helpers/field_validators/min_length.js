"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minLengthField = void 0;

var _string = require("../../../validators/string");

var _array = require("../../../validators/array");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const minLengthField = ({
  length = 0,
  message
}) => (...args) => {
  const [{
    value
  }] = args; // Validate for Arrays

  if (Array.isArray(value)) {
    return (0, _array.hasMinLengthArray)(length)(value) ? undefined : {
      code: 'ERR_MIN_LENGTH',
      length,
      message: typeof message === 'function' ? message({
        length
      }) : message
    };
  } // Validate for Strings


  return (0, _string.hasMinLengthString)(length)(value.trim()) ? undefined : {
    code: 'ERR_MIN_LENGTH',
    length,
    message: typeof message === 'function' ? message({
      length
    }) : message
  };
};

exports.minLengthField = minLengthField;