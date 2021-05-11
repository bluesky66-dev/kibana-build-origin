"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = merge;

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

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


function merge(types) {
  const mergeType = new t.Type('merge', u => {
    return types.every(type => type.is(u));
  }, (input, context) => {
    const errors = [];
    const successes = [];
    const results = types.map((type, index) => type.validate(input, context.concat({
      key: String(index),
      type,
      actual: input
    })));
    results.forEach(result => {
      if ((0, _Either.isLeft)(result)) {
        errors.push(...result.left);
      } else {
        successes.push(result.right);
      }
    });
    const mergedValues = (0, _lodash.merge)({}, ...successes);
    return errors.length > 0 ? t.failures(errors) : t.success(mergedValues);
  }, a => types.reduce((val, type) => type.encode(val), a));
  return { ...mergeType,
    _tag: 'MergeType',
    types
  };
}