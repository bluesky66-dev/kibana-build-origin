"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNestedProperty = getNestedProperty;
exports.isPopulatedObject = exports.setNestedProperty = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This is similar to lodash's get() except that it's TypeScript aware and is able to infer return types.
// It splits the attribute key string and uses reduce with an idx check to access nested attributes.

function getNestedProperty(obj, accessor, defaultValue) {
  const accessorKeys = accessor.split('.');
  let o = obj;

  for (let i = 0; i < accessorKeys.length; i++) {
    var _o;

    const keyPart = accessorKeys[i];
    o = (_o = o) === null || _o === void 0 ? void 0 : _o[keyPart];

    if (Array.isArray(o)) {
      o = o.map(v => typeof v === 'object' ? // from this point we need to resolve path for each element in the collection
      getNestedProperty(v, accessorKeys.slice(i + 1, accessorKeys.length).join('.')) : v);
      break;
    }
  }

  if (o === undefined) return defaultValue;
  return o;
}

const setNestedProperty = (obj, accessor, value) => {
  let ref = obj;
  const accessors = accessor.split('.');
  const len = accessors.length;

  for (let i = 0; i < len - 1; i++) {
    const attribute = accessors[i];

    if (ref[attribute] === undefined) {
      ref[attribute] = {};
    }

    ref = ref[attribute];
  }

  ref[accessors[len - 1]] = value;
  return obj;
};

exports.setNestedProperty = setNestedProperty;

const isPopulatedObject = arg => {
  return typeof arg === 'object' && arg !== null && Object.keys(arg).length > 0;
};

exports.isPopulatedObject = isPopulatedObject;