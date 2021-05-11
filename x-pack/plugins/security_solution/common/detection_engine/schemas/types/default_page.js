"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultPage = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _positive_integer_greater_than_zero = require("./positive_integer_greater_than_zero");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Types the DefaultPerPage as:
 *   - If a string this will convert the string to a number
 *   - If null or undefined, then a default of 1 will be used
 *   - If the number is 0 or less this will not validate as it has to be a positive number greater than zero
 */


const DefaultPage = new t.Type('DefaultPerPage', t.number.is, (input, context) => {
  if (input == null) {
    return t.success(1);
  } else if (typeof input === 'string') {
    return _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero.validate(parseInt(input, 10), context);
  } else {
    return _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero.validate(input, context);
  }
}, t.identity);
exports.DefaultPage = DefaultPage;