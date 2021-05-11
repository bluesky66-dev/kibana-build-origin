"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatResponseObjectValues = exports.mapObjectValuesToStringArray = void 0;

var _fp = require("lodash/fp");

var _to_array = require("./to_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mapObjectValuesToStringArray = object => (0, _fp.mapValues)(o => {
  if ((0, _fp.isObject)(o) && !(0, _fp.isArray)(o)) {
    return mapObjectValuesToStringArray(o);
  }

  return (0, _to_array.toArray)(o);
}, object);

exports.mapObjectValuesToStringArray = mapObjectValuesToStringArray;

const formatResponseObjectValues = object => {
  if (object && typeof object === 'object') {
    return mapObjectValuesToStringArray(object);
  }

  return object;
};

exports.formatResponseObjectValues = formatResponseObjectValues;