"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlField = void 0;

var _string = require("../../../validators/string");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const urlField = message => (...args) => {
  const [{
    value
  }] = args;
  const error = {
    code: 'ERR_FIELD_FORMAT',
    formatType: 'URL',
    message
  };

  if (typeof value !== 'string') {
    return error;
  }

  return (0, _string.isUrl)(value) ? undefined : error;
};

exports.urlField = urlField;