"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Handlebars = void 0;

var _handlebars = _interopRequireDefault(require("handlebars/dist/handlebars"));

var _tinymath = require("@kbn/tinymath");

var _pivot_object_array = require("./pivot_object_array");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// example use: {{math rows 'mean(price - cost)' 2}}


_handlebars.default.registerHelper('math', (rows, expression, precision) => {
  if (!Array.isArray(rows)) {
    return 'MATH ERROR: first argument must be an array';
  }

  const value = (0, _tinymath.evaluate)(expression, (0, _pivot_object_array.pivotObjectArray)(rows));

  try {
    return precision ? value.toFixed(precision) : value;
  } catch (e) {
    return value;
  }
});

const Handlebars = _handlebars.default;
exports.Handlebars = Handlebars;