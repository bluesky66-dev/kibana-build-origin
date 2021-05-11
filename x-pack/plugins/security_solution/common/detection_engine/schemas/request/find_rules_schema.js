"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRulesSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _schemas = require("../common/schemas");

var _default_per_page = require("../types/default_per_page");

var _default_page = require("../types/default_page");

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


const findRulesSchema = t.exact(t.partial({
  fields: _schemas.fields,
  filter: _schemas.queryFilter,
  per_page: _default_per_page.DefaultPerPage,
  // defaults to "20" if not sent in during decode
  page: _default_page.DefaultPage,
  // defaults to "1" if not sent in during decode
  sort_field: _schemas.sort_field,
  sort_order: _schemas.sort_order
}));
exports.findRulesSchema = findRulesSchema;