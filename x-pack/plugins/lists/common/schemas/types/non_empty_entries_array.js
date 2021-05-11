"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nonEmptyEntriesArray = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _entries = require("./entries");

var _entry_list = require("./entry_list");

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
 * Types the nonEmptyEntriesArray as:
 *   - An array of entries of length 1 or greater
 *
 */


const nonEmptyEntriesArray = new t.Type('NonEmptyEntriesArray', _entries.entriesArray.is, (input, context) => {
  if (Array.isArray(input) && input.length === 0) {
    return t.failure(input, context);
  } else {
    if (Array.isArray(input) && input.some(entry => _entry_list.entriesList.is(entry)) && input.some(entry => !_entry_list.entriesList.is(entry))) {
      // fail when an exception item contains both a value list entry and a non-value list entry
      return t.failure(input, context, 'Cannot have entry of type list and other');
    }

    return _entries.entriesArray.validate(input, context);
  }
}, t.identity);
exports.nonEmptyEntriesArray = nonEmptyEntriesArray;