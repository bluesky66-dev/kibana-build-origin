"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  STACK_ALERTS_FEATURE_ID: true
};
exports.STACK_ALERTS_FEATURE_ID = void 0;

var _config = require("./config");

Object.keys(_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _config[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const STACK_ALERTS_FEATURE_ID = 'stackAlerts';
exports.STACK_ALERTS_FEATURE_ID = STACK_ALERTS_FEATURE_ID;