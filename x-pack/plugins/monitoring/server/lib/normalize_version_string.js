"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeVersionString = normalizeVersionString;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function normalizeVersionString(string) {
  if (string) {
    // get just the number.number.number portion (filter out '-snapshot')
    const matches = string.match(/^\d+\.\d+.\d+/);

    if (matches) {
      // escape() because the string could be rendered in UI
      return (0, _lodash.escape)(matches[0]);
    }
  }

  return '';
}