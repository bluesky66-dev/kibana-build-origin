"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findListSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _schemas = require("../common/schemas");

var _string_to_positive_number = require("../types/string_to_positive_number");

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


const findListSchema = t.exact(t.partial({
  cursor: _schemas.cursor,
  // defaults to undefined if not set during decode
  filter: _schemas.filter,
  // defaults to undefined if not set during decode
  page: _string_to_positive_number.StringToPositiveNumber,
  // defaults to undefined if not set during decode
  per_page: _string_to_positive_number.StringToPositiveNumber,
  // defaults to undefined if not set during decode
  sort_field: _schemas.sort_field,
  // defaults to undefined if not set during decode
  sort_order: _schemas.sort_order // defaults to undefined if not set during decode

}));
exports.findListSchema = findListSchema;