"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectFindOptionsRt = exports.NumberFromString = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

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


const NumberFromString = new rt.Type('NumberFromString', rt.number.is, (u, c) => _Either.either.chain(rt.string.validate(u, c), s => {
  const n = +s;
  return isNaN(n) ? rt.failure(u, c, 'cannot parse to a number') : rt.success(n);
}), String);
exports.NumberFromString = NumberFromString;
const ReferenceRt = rt.type({
  id: rt.string,
  type: rt.string
});
const SavedObjectFindOptionsRt = rt.partial({
  defaultSearchOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),
  hasReferenceOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),
  hasReference: rt.union([rt.array(ReferenceRt), ReferenceRt]),
  fields: rt.array(rt.string),
  filter: rt.string,
  page: NumberFromString,
  perPage: NumberFromString,
  search: rt.string,
  searchFields: rt.array(rt.string),
  sortField: rt.string,
  sortOrder: rt.union([rt.literal('desc'), rt.literal('asc')])
});
exports.SavedObjectFindOptionsRt = SavedObjectFindOptionsRt;