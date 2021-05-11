"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containsCharsField = void 0;

var _string = require("../../../validators/string");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const containsCharsField = ({
  message,
  chars
}) => (...args) => {
  const [{
    value
  }] = args;

  if (typeof value !== 'string') {
    return;
  }

  const {
    doesContain,
    charsFound
  } = (0, _string.containsChars)(chars)(value);

  if (doesContain) {
    return {
      code: 'ERR_INVALID_CHARS',
      charsFound,
      message: typeof message === 'function' ? message({
        charsFound
      }) : message
    };
  }
};

exports.containsCharsField = containsCharsField;