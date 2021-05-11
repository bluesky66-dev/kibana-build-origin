"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CertResultType = exports.CertType = exports.CertMonitorType = exports.GetCertsParamsType = void 0;

var t = _interopRequireWildcard(require("io-ts"));

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


const GetCertsParamsType = t.intersection([t.type({
  index: t.number,
  size: t.number,
  sortBy: t.string,
  direction: t.string
}), t.partial({
  search: t.string,
  notValidBefore: t.string,
  notValidAfter: t.string,
  from: t.string,
  to: t.string
})]);
exports.GetCertsParamsType = GetCertsParamsType;
const CertMonitorType = t.partial({
  name: t.string,
  id: t.string,
  url: t.string
});
exports.CertMonitorType = CertMonitorType;
const CertType = t.intersection([t.type({
  monitors: t.array(CertMonitorType),
  sha256: t.string
}), t.partial({
  not_after: t.string,
  not_before: t.string,
  common_name: t.string,
  issuer: t.string,
  sha1: t.string
})]);
exports.CertType = CertType;
const CertResultType = t.type({
  certs: t.array(CertType),
  total: t.number
});
exports.CertResultType = CertResultType;