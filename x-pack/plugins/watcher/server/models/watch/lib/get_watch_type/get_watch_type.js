"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWatchType = getWatchType;

var _lodash = require("lodash");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getWatchType(watchJson) {
  const type = (0, _lodash.get)(watchJson, 'metadata.xpack.type');

  if ((0, _lodash.includes)((0, _lodash.values)(_constants.WATCH_TYPES), type)) {
    return type;
  }

  return _constants.WATCH_TYPES.JSON;
}