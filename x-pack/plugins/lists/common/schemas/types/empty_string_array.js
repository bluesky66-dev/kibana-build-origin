"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmptyStringArray = void 0;

var t = _interopRequireWildcard(require("io-ts"));

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
 * Types the EmptyStringArray as:
 *   - A value that can be undefined, or null (which will be turned into an empty array)
 *   - A comma separated string that can turn into an array by splitting on it
 *   - Example input converted to output: undefined -> []
 *   - Example input converted to output: null -> []
 *   - Example input converted to output: "a,b,c" -> ["a", "b", "c"]
 */


const EmptyStringArray = new t.Type('EmptyStringArray', t.array(t.string).is, (input, context) => {
  if (input == null) {
    return t.success([]);
  } else if (typeof input === 'string' && input.trim() !== '') {
    const arrayValues = input.trim().split(',').map(value => value.trim());
    const emptyValueFound = arrayValues.some(value => value === '');

    if (emptyValueFound) {
      return t.failure(input, context);
    } else {
      return t.success(arrayValues);
    }
  } else {
    return t.failure(input, context);
  }
}, String);
exports.EmptyStringArray = EmptyStringArray;