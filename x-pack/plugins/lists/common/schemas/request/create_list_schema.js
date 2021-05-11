"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _schemas = require("../common/schemas");

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


const createListSchema = t.intersection([t.exact(t.type({
  description: _schemas.description,
  name: _schemas.name,
  type: _schemas.type
})), t.exact(t.partial({
  deserializer: _schemas.deserializer,
  // defaults to undefined if not set during decode
  id: _schemas.id,
  // defaults to undefined if not set during decode
  meta: _schemas.meta,
  // defaults to undefined if not set during decode
  serializer: _schemas.serializer,
  // defaults to undefined if not set during decode
  version: _shared_imports.DefaultVersionNumber // defaults to a numerical 1 if not set during decode

}))]);
exports.createListSchema = createListSchema;