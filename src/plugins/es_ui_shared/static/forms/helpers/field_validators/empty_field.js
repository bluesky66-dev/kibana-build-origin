"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emptyField = void 0;

var _string = require("../../../validators/string");

var _array = require("../../../validators/array");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const emptyField = message => (...args) => {
  const [{
    value,
    path
  }] = args;

  if (typeof value === 'string') {
    return (0, _string.isEmptyString)(value) ? {
      code: 'ERR_FIELD_MISSING',
      path,
      message
    } : undefined;
  }

  if (Array.isArray(value)) {
    return (0, _array.isEmptyArray)(value) ? {
      code: 'ERR_FIELD_MISSING',
      path,
      message
    } : undefined;
  }
};

exports.emptyField = emptyField;