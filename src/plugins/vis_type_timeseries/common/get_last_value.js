"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLastValue = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_VALUE = '-';

const extractValue = data => {
  var _ref;

  return (_ref = data && data[1]) !== null && _ref !== void 0 ? _ref : null;
};

const getLastValue = (data, defaultValue = DEFAULT_VALUE) => {
  var _extractValue;

  if (!(0, _lodash.isArray)(data)) {
    return data !== null && data !== void 0 ? data : defaultValue;
  }

  return (_extractValue = extractValue((0, _lodash.last)(data))) !== null && _extractValue !== void 0 ? _extractValue : defaultValue;
};

exports.getLastValue = getLastValue;