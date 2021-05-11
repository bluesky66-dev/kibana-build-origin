"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  functionSpecs: true
};
exports.functionSpecs = void 0;

var _clog = require("./clog");

Object.keys(_clog).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _clog[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _clog[key];
    }
  });
});

var _font = require("./font");

Object.keys(_font).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _font[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _font[key];
    }
  });
});

var _var_set = require("./var_set");

Object.keys(_var_set).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _var_set[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _var_set[key];
    }
  });
});

var _var = require("./var");

Object.keys(_var).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _var[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _var[key];
    }
  });
});

var _theme = require("./theme");

Object.keys(_theme).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _theme[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _theme[key];
    }
  });
});

var _cumulative_sum = require("./cumulative_sum");

Object.keys(_cumulative_sum).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cumulative_sum[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cumulative_sum[key];
    }
  });
});

var _derivative = require("./derivative");

Object.keys(_derivative).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _derivative[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _derivative[key];
    }
  });
});

var _moving_average = require("./moving_average");

Object.keys(_moving_average).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _moving_average[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _moving_average[key];
    }
  });
});

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const functionSpecs = [_clog.clog, _font.font, _var_set.variableSet, _var.variable, _theme.theme, _cumulative_sum.cumulativeSum, _derivative.derivative, _moving_average.movingAverage];
exports.functionSpecs = functionSpecs;