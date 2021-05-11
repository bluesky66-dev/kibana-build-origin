"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  entries: true
};
exports.entries = void 0;

var _models = require("./models");

Object.keys(_models).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _models[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _models[key];
    }
  });
});

var _rest_spec = require("./rest_spec");

Object.keys(_rest_spec).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rest_spec[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rest_spec[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Calling Object.entries(PackagesGroupedByStatus) gave `status: string`
// which causes a "string is not assignable to type InstallationStatus` error
// see https://github.com/Microsoft/TypeScript/issues/20322
// and https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
// and https://github.com/Microsoft/TypeScript/issues/21826#issuecomment-479851685

const entries = Object.entries;
/**
 * Creates a Union Type for all the values of an object
 */

exports.entries = entries;