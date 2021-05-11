"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

var _timelion = _interopRequireDefault(require("../timelion.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function _default() {
  function flattenWith(dot, nestedObj, flattenArrays) {
    const stack = []; // track key stack

    const flatObj = {};

    (function flattenObj(obj) {
      _lodash.default.keys(obj).forEach(function (key) {
        stack.push(key);
        if (!flattenArrays && Array.isArray(obj[key])) flatObj[stack.join(dot)] = obj[key];else if (_lodash.default.isObject(obj[key])) flattenObj(obj[key]);else flatObj[stack.join(dot)] = obj[key];
        stack.pop();
      });
    })(nestedObj);

    return flatObj;
  }

  const timelionDefaults = flattenWith('.', _timelion.default);
  return _lodash.default.reduce(timelionDefaults, (result, value, key) => {
    result['timelion:' + key] = value;
    return result;
  }, {});
}

module.exports = exports.default;