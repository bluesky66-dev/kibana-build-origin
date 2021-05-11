"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberGreaterThanField = void 0;

var _number = require("../../../validators/number");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const numberGreaterThanField = ({
  than,
  message,
  allowEquality = false
}) => (...args) => {
  const [{
    value
  }] = args;
  return (0, _number.isNumberGreaterThan)(than, allowEquality)(value) ? undefined : {
    code: 'ERR_GREATER_THAN_NUMBER',
    than,
    message: typeof message === 'function' ? message({
      than
    }) : message
  };
};

exports.numberGreaterThanField = numberGreaterThanField;