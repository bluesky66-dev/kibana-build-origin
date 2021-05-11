"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rawAlertInstance = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _date_from_string = require("./date_from_string");

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


const metaSchema = t.partial({
  lastScheduledActions: t.intersection([t.partial({
    subgroup: t.string
  }), t.type({
    group: t.string,
    date: _date_from_string.DateFromString
  })])
});
const stateSchema = t.record(t.string, t.unknown);
const contextSchema = t.record(t.string, t.unknown);
const rawAlertInstance = t.partial({
  state: stateSchema,
  meta: metaSchema
});
exports.rawAlertInstance = rawAlertInstance;