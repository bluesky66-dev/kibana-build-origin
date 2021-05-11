"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conflictErrorRT = exports.forbiddenErrorRT = exports.badRequestErrorRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

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


const badRequestErrorRT = rt.intersection([rt.type({
  statusCode: rt.literal(400),
  error: rt.literal('Bad Request'),
  message: rt.string
}), rt.partial({
  attributes: rt.unknown
})]);
exports.badRequestErrorRT = badRequestErrorRT;
const forbiddenErrorRT = rt.intersection([rt.type({
  statusCode: rt.literal(403),
  error: rt.literal('Forbidden'),
  message: rt.string
}), rt.partial({
  attributes: rt.unknown
})]);
exports.forbiddenErrorRT = forbiddenErrorRT;
const conflictErrorRT = rt.intersection([rt.type({
  statusCode: rt.literal(409),
  error: rt.literal('Conflict'),
  message: rt.string
}), rt.partial({
  attributes: rt.unknown
})]);
exports.conflictErrorRT = conflictErrorRT;