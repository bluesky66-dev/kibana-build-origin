"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lowerCaseStringField = void 0;

var _string = require("../../../validators/string");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const lowerCaseStringField = message => (...args) => {
  const [{
    value
  }] = args;

  if (typeof value !== 'string') {
    return;
  }

  if (!(0, _string.isLowerCaseString)(value)) {
    return {
      code: 'ERR_LOWERCASE_STRING',
      message
    };
  }
};

exports.lowerCaseStringField = lowerCaseStringField;