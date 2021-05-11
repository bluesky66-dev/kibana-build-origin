"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCommentsArrayOrUndefined = exports.createCommentsArray = exports.createComment = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _shared_imports = require("../../shared_imports");

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


const createComment = t.exact(t.type({
  comment: _shared_imports.NonEmptyString
}));
exports.createComment = createComment;
const createCommentsArray = t.array(createComment);
exports.createCommentsArray = createCommentsArray;
const createCommentsArrayOrUndefined = t.union([createCommentsArray, t.undefined]);
exports.createCommentsArrayOrUndefined = createCommentsArrayOrUndefined;