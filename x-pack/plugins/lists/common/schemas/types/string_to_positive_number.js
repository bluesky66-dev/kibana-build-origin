"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringToPositiveNumber = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _Either = require("fp-ts/lib/Either");

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
 * Types the StrongToPositiveNumber as:
 *   - If a string this converts the string into a number
 *   - Ensures it is a number (and not NaN)
 *   - Ensures it is positive number
 */


const StringToPositiveNumber = new t.Type('StringToPositiveNumber', t.number.is, (input, context) => {
  return _Either.either.chain(t.string.validate(input, context), numberAsString => {
    const stringAsNumber = +numberAsString;

    if (numberAsString.trim().length === 0 || isNaN(stringAsNumber) || stringAsNumber <= 0) {
      return t.failure(input, context);
    } else {
      return t.success(stringAsNumber);
    }
  });
}, String);
exports.StringToPositiveNumber = StringToPositiveNumber;