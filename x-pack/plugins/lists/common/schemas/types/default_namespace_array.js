"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultNamespaceArray = exports.namespaceTypeArray = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _default_namespace = require("./default_namespace");

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


const namespaceTypeArray = t.array(_default_namespace.namespaceType);
exports.namespaceTypeArray = namespaceTypeArray;
/**
 * Types the DefaultNamespaceArray as:
 *   - If null or undefined, then a default string array of "single" will be used.
 *   - If it contains a string, then it is split along the commas and puts them into an array and validates it
 */

const DefaultNamespaceArray = new t.Type('DefaultNamespaceArray', namespaceTypeArray.is, (input, context) => {
  if (input == null) {
    return t.success(['single']);
  } else if (typeof input === 'string') {
    const commaSeparatedValues = input.trim().split(',').map(value => value.trim());
    return namespaceTypeArray.validate(commaSeparatedValues, context);
  }

  return t.failure(input, context);
}, String);
exports.DefaultNamespaceArray = DefaultNamespaceArray;