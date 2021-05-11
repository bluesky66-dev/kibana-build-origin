"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = exports.TEXT_CONTEXT_TYPE = void 0;

var _lodash = require("lodash");

var _utils = require("../utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const TEXT_CONTEXT_TYPE = 'text';
exports.TEXT_CONTEXT_TYPE = TEXT_CONTEXT_TYPE;

const setup = (format, convert = _utils.asPrettyString) => {
  const recurse = value => {
    if (!value || !(0, _lodash.isFunction)(value.map)) {
      return convert.call(format, value);
    } // format a list of values. In text contexts we just use JSON encoding


    return JSON.stringify(value.map(recurse));
  };

  return recurse;
};

exports.setup = setup;