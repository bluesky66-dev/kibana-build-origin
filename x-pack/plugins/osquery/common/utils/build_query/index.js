"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  inspectStringifyObject: true
};
exports.inspectStringifyObject = void 0;

var _filters = require("./filters");

Object.keys(_filters).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _filters[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _filters[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const inspectStringifyObject = obj => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return 'Sorry about that, something went wrong.';
  }
};

exports.inspectStringifyObject = inspectStringifyObject;