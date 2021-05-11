"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionType = getActionType;

var _lodash = require("lodash");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getActionType(action) {
  const type = (0, _lodash.intersection)((0, _lodash.keys)(action), (0, _lodash.values)(_constants.ACTION_TYPES))[0] || _constants.ACTION_TYPES.UNKNOWN;

  return type;
}