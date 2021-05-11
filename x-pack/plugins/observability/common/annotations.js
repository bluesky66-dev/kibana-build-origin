"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotationByIdRt = exports.deleteAnnotationRt = exports.createAnnotationRt = void 0;

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
 * Checks whether a string is a valid ISO timestamp,
 * but doesn't convert it into a Date object when decoding.
 *
 * Copied from x-pack/plugins/apm/common/runtime_types/date_as_string_rt.ts.
 */


const dateAsStringRt = new t.Type('DateAsString', t.string.is, (input, context) => _Either.either.chain(t.string.validate(input, context), str => {
  const date = new Date(str);
  return isNaN(date.getTime()) ? t.failure(input, context) : t.success(str);
}), t.identity);
const createAnnotationRt = t.intersection([t.type({
  annotation: t.type({
    type: t.string
  }),
  '@timestamp': dateAsStringRt,
  message: t.string
}), t.partial({
  tags: t.array(t.string),
  service: t.partial({
    name: t.string,
    environment: t.string,
    version: t.string
  })
})]);
exports.createAnnotationRt = createAnnotationRt;
const deleteAnnotationRt = t.type({
  id: t.string
});
exports.deleteAnnotationRt = deleteAnnotationRt;
const getAnnotationByIdRt = t.type({
  id: t.string
});
exports.getAnnotationByIdRt = getAnnotationByIdRt;