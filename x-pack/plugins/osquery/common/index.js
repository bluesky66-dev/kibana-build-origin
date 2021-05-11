"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PLUGIN_ID: true,
  PLUGIN_NAME: true
};
exports.PLUGIN_NAME = exports.PLUGIN_ID = void 0;

var _constants = require("./constants");

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _constants[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _constants[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN_ID = 'osquery';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'osquery';
exports.PLUGIN_NAME = PLUGIN_NAME;