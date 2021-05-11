"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchEsListItemSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

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


const searchEsListItemSchema = t.exact(t.type({
  binary: _schemas.binaryOrUndefined,
  boolean: _schemas.booleanOrUndefined,
  byte: _schemas.byteOrUndefined,
  created_at: _schemas.created_at,
  created_by: _schemas.created_by,
  date: _schemas.dateOrUndefined,
  date_nanos: _schemas.dateNanosOrUndefined,
  date_range: _schemas.dateRangeOrUndefined,
  deserializer: _schemas.deserializerOrUndefined,
  double: _schemas.doubleOrUndefined,
  double_range: _schemas.doubleRangeOrUndefined,
  float: _schemas.floatOrUndefined,
  float_range: _schemas.floatRangeOrUndefined,
  geo_point: _schemas.geoPointOrUndefined,
  geo_shape: _schemas.geoShapeOrUndefined,
  half_float: _schemas.halfFloatOrUndefined,
  integer: _schemas.integerOrUndefined,
  integer_range: _schemas.integerRangeOrUndefined,
  ip: _schemas.ipOrUndefined,
  ip_range: _schemas.ipRangeOrUndefined,
  keyword: _schemas.keywordOrUndefined,
  list_id: _schemas.list_id,
  long: _schemas.longOrUndefined,
  long_range: _schemas.longRangeOrUndefined,
  meta: _schemas.metaOrUndefined,
  serializer: _schemas.serializerOrUndefined,
  shape: _schemas.shapeOrUndefined,
  short: _schemas.shortOrUndefined,
  text: _schemas.textOrUndefined,
  tie_breaker_id: _schemas.tie_breaker_id,
  updated_at: _schemas.updated_at,
  updated_by: _schemas.updated_by
}));
exports.searchEsListItemSchema = searchEsListItemSchema;