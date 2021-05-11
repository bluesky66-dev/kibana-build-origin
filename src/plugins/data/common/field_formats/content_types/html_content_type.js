"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = exports.HTML_CONTEXT_TYPE = void 0;

var _lodash = require("lodash");

var _utils = require("../utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const HTML_CONTEXT_TYPE = 'html';
exports.HTML_CONTEXT_TYPE = HTML_CONTEXT_TYPE;

const getConvertFn = (format, convert) => {
  const fallbackHtml = (value, options = {}) => {
    const {
      field,
      hit
    } = options;
    const formatted = (0, _lodash.escape)(format.convert(value, 'text'));
    return !field || !hit || !hit.highlight || !hit.highlight[field.name] ? formatted : (0, _utils.getHighlightHtml)(formatted, hit.highlight[field.name]);
  };

  return convert || fallbackHtml;
};

const setup = (format, htmlContextTypeConvert) => {
  const convert = getConvertFn(format, htmlContextTypeConvert);

  const recurse = (value, options = {}) => {
    if (value == null) {
      return (0, _utils.asPrettyString)(value);
    }

    if (!value || !(0, _lodash.isFunction)(value.map)) {
      return convert.call(format, value, options);
    }

    const subValues = value.map(v => recurse(v, options));
    const useMultiLine = subValues.some(sub => sub.indexOf('\n') > -1);
    return subValues.join(',' + (useMultiLine ? '\n' : ' '));
  };

  const wrap = (value, options) => {
    return `<span ng-non-bindable>${recurse(value, options)}</span>`;
  };

  return wrap;
};

exports.setup = setup;