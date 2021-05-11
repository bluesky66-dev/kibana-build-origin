"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildBoolArray = buildBoolArray;

var _get_es_filter = require("./get_es_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const compact = arr => Array.isArray(arr) ? arr.filter(val => Boolean(val)) : [];

function buildBoolArray(canvasQueryFilterArray) {
  return compact(canvasQueryFilterArray.map(clause => {
    try {
      return (0, _get_es_filter.getESFilter)(clause);
    } catch (e) {
      return;
    }
  }));
}