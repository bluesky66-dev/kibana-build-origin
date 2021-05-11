"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickKeys = pickKeys;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function pickKeys(obj, ...keys) {
  return (0, _lodash.pick)(obj, keys);
}