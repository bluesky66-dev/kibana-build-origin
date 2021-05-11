"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prePackagedRulesAndTimelinesStatusSchema = exports.prePackagedTimelinesStatusSchema = void 0;

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


const prePackagedTimelinesStatusSchema = t.type({
  timelines_installed: _schemas.timelines_installed,
  timelines_not_installed: _schemas.timelines_not_installed,
  timelines_not_updated: _schemas.timelines_not_updated
});
exports.prePackagedTimelinesStatusSchema = prePackagedTimelinesStatusSchema;
const prePackagedRulesStatusSchema = t.type({
  rules_custom_installed: _schemas.rules_custom_installed,
  rules_installed: _schemas.rules_installed,
  rules_not_installed: _schemas.rules_not_installed,
  rules_not_updated: _schemas.rules_not_updated
});
const prePackagedRulesAndTimelinesStatusSchema = t.exact(t.intersection([prePackagedRulesStatusSchema, prePackagedTimelinesStatusSchema]));
exports.prePackagedRulesAndTimelinesStatusSchema = prePackagedRulesAndTimelinesStatusSchema;