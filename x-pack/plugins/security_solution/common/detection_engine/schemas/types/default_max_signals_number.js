"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultMaxSignalsNumber = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _schemas = require("../common/schemas");

var _constants = require("../../../constants");

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
 * Types the default max signal:
 *   - Natural Number (positive integer and not a float),
 *   - greater than 1
 *   - If undefined then it will use DEFAULT_MAX_SIGNALS (100) as the default
 */


const DefaultMaxSignalsNumber = new t.Type('DefaultMaxSignals', t.number.is, (input, context) => {
  return input == null ? t.success(_constants.DEFAULT_MAX_SIGNALS) : _schemas.max_signals.validate(input, context);
}, t.identity);
exports.DefaultMaxSignalsNumber = DefaultMaxSignalsNumber;