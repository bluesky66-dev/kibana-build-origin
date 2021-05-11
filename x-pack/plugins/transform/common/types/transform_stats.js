"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransformStats = isTransformStats;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isTransformStats(arg) {
  return typeof arg === 'object' && arg !== null && {}.hasOwnProperty.call(arg, 'state') && Object.values(_constants.TRANSFORM_STATE).includes(arg.state);
}