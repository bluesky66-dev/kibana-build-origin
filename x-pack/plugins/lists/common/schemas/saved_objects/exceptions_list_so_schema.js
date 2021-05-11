"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exceptionListSoSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _types = require("../types");

var _schemas = require("../common/schemas");

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
 * Superset saved object of both lists and list items since they share the same saved object type.
 */


const exceptionListSoSchema = t.exact(t.type({
  comments: _types.commentsArrayOrUndefined,
  created_at: _schemas.created_at,
  created_by: _schemas.created_by,
  description: _schemas.description,
  entries: _types.entriesArrayOrUndefined,
  immutable: _schemas.immutableOrUndefined,
  item_id: _schemas.itemIdOrUndefined,
  list_id: _schemas.list_id,
  list_type: _schemas.list_type,
  meta: _schemas.metaOrUndefined,
  name: _schemas.name,
  os_types: _schemas.osTypeArray,
  tags: _schemas.tags,
  tie_breaker_id: _schemas.tie_breaker_id,
  type: t.union([_schemas.exceptionListType, _schemas.exceptionListItemType]),
  updated_by: _schemas.updated_by,
  version: _schemas.versionOrUndefined
}));
exports.exceptionListSoSchema = exceptionListSoSchema;