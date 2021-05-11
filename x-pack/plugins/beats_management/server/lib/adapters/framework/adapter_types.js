"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuntimeKibanaUser = exports.RuntimeKibanaServerRequest = exports.RuntimeFrameworkInfo = exports.internalUser = exports.internalAuthData = void 0;

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

/* eslint-disable @typescript-eslint/no-empty-interface */


const internalAuthData = Symbol('internalAuthData');
exports.internalAuthData = internalAuthData;
const internalUser = {
  kind: 'internal'
};
exports.internalUser = internalUser;
const RuntimeFrameworkInfo = t.interface({
  kibana: t.type({
    version: t.string
  }),
  license: t.type({
    type: t.keyof({
      oss: null,
      trial: null,
      standard: null,
      basic: null,
      gold: null,
      platinum: null,
      enterprise: null
    }),
    expired: t.boolean,
    expiry_date_in_millis: t.number
  }),
  security: t.type({
    enabled: t.boolean,
    available: t.boolean
  }),
  watcher: t.type({
    enabled: t.boolean,
    available: t.boolean
  })
}, 'FrameworkInfo');
exports.RuntimeFrameworkInfo = RuntimeFrameworkInfo;
const RuntimeKibanaServerRequest = t.interface({
  params: t.object,
  payload: t.object,
  query: t.object,
  headers: t.type({
    authorization: t.union([t.string, t.null])
  }),
  info: t.type({
    remoteAddress: t.string
  })
}, 'KibanaServerRequest');
exports.RuntimeKibanaServerRequest = RuntimeKibanaServerRequest;
const RuntimeKibanaUser = t.interface({
  username: t.string,
  roles: t.readonlyArray(t.string),
  full_name: t.union([t.null, t.string]),
  email: t.union([t.null, t.string]),
  enabled: t.boolean
}, 'KibanaUser');
exports.RuntimeKibanaUser = RuntimeKibanaUser;