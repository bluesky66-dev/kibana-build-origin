"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "JsonArray", {
  enumerable: true,
  get: function () {
    return _common.JsonArray;
  }
});
Object.defineProperty(exports, "JsonObject", {
  enumerable: true,
  get: function () {
    return _common.JsonObject;
  }
});
Object.defineProperty(exports, "JsonValue", {
  enumerable: true,
  get: function () {
    return _common.JsonValue;
  }
});
exports.jsonObjectRT = exports.jsonArrayRT = exports.jsonValueRT = exports.jsonScalarRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _common = require("../../../../src/plugins/kibana_utils/common");

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


const jsonScalarRT = rt.union([rt.null, rt.boolean, rt.number, rt.string]);
exports.jsonScalarRT = jsonScalarRT;
const jsonValueRT = rt.recursion('JsonValue', () => rt.union([jsonScalarRT, jsonArrayRT, jsonObjectRT]));
exports.jsonValueRT = jsonValueRT;
const jsonArrayRT = rt.recursion('JsonArray', () => rt.array(jsonValueRT));
exports.jsonArrayRT = jsonArrayRT;
const jsonObjectRT = rt.recursion('JsonObject', () => rt.record(rt.string, jsonValueRT));
exports.jsonObjectRT = jsonObjectRT;