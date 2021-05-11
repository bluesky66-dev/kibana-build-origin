"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floatRt = void 0;

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


const floatRt = new t.Type('floatRt', t.string.is, (input, context) => {
  return _Either.either.chain(t.string.validate(input, context), inputAsString => {
    const inputAsFloat = parseFloat(inputAsString);
    const maxThreeDecimals = parseFloat(inputAsFloat.toFixed(3)) === inputAsFloat;
    const isValid = inputAsFloat >= 0 && inputAsFloat <= 1 && maxThreeDecimals;
    return isValid ? t.success(inputAsString) : t.failure(input, context, 'Must be a number between 0.000 and 1');
  });
}, t.identity);
exports.floatRt = floatRt;