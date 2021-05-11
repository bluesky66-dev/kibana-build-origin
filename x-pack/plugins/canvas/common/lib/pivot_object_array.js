"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pivotObjectArray = pivotObjectArray;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isString = val => typeof val === 'string';

function pivotObjectArray(rows, columns) {
  const columnNames = columns || Object.keys(rows[0]);

  if (!columnNames.every(isString)) {
    throw new Error('Columns should be an array of strings');
  }

  const columnValues = (0, _lodash.map)(columnNames, name => (0, _lodash.map)(rows, name));
  return (0, _lodash.zipObject)(columnNames, columnValues);
}