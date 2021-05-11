"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nonEmptyNestedEntriesArray = exports.nestedEntriesArray = exports.nestedEntryItem = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _entry_match_any = require("./entry_match_any");

var _entry_match = require("./entry_match");

var _entry_exists = require("./entry_exists");

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


const nestedEntryItem = t.union([_entry_match.entriesMatch, _entry_match_any.entriesMatchAny, _entry_exists.entriesExists]);
exports.nestedEntryItem = nestedEntryItem;
const nestedEntriesArray = t.array(nestedEntryItem);
exports.nestedEntriesArray = nestedEntriesArray;
/**
 * Types the nonEmptyNestedEntriesArray as:
 *   - An array of entries of length 1 or greater
 *
 */

const nonEmptyNestedEntriesArray = new t.Type('NonEmptyNestedEntriesArray', nestedEntriesArray.is, (input, context) => {
  if (Array.isArray(input) && input.length === 0) {
    return t.failure(input, context);
  } else {
    return nestedEntriesArray.validate(input, context);
  }
}, t.identity);
exports.nonEmptyNestedEntriesArray = nonEmptyNestedEntriesArray;