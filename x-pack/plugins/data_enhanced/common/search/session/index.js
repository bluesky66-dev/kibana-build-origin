"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SEARCH_SESSIONS_TABLE_ID: true
};
exports.SEARCH_SESSIONS_TABLE_ID = void 0;

var _status = require("./status");

Object.keys(_status).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _status[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _status[key];
    }
  });
});

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SEARCH_SESSIONS_TABLE_ID = 'searchSessionsMgmtUiTable';
exports.SEARCH_SESSIONS_TABLE_ID = SEARCH_SESSIONS_TABLE_ID;