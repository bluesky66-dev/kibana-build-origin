"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  inspectStringifyObject: true
};
exports.inspectStringifyObject = void 0;

var _fields = require("./fields");

Object.keys(_fields).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _fields[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fields[key];
    }
  });
});

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

var _merge_fields_with_hits = require("./merge_fields_with_hits");

Object.keys(_merge_fields_with_hits).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _merge_fields_with_hits[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _merge_fields_with_hits[key];
    }
  });
});

var _calculate_timeseries_interval = require("./calculate_timeseries_interval");

Object.keys(_calculate_timeseries_interval).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _calculate_timeseries_interval[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _calculate_timeseries_interval[key];
    }
  });
});

var _reduce_fields = require("./reduce_fields");

Object.keys(_reduce_fields).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _reduce_fields[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _reduce_fields[key];
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