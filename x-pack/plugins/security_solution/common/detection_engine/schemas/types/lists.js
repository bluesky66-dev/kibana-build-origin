"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listArrayOrUndefined = exports.listArray = exports.list = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _shared_imports = require("../../../shared_imports");

var _non_empty_string = require("./non_empty_string");

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


const list = t.exact(t.type({
  id: _non_empty_string.NonEmptyString,
  list_id: _non_empty_string.NonEmptyString,
  type: _shared_imports.exceptionListType,
  namespace_type: _shared_imports.namespaceType
}));
exports.list = list;
const listArray = t.array(list);
exports.listArray = listArray;
const listArrayOrUndefined = t.union([listArray, t.undefined]);
exports.listArrayOrUndefined = listArrayOrUndefined;