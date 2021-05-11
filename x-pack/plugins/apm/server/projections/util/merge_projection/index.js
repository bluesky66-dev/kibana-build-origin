"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeProjection = mergeProjection;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mergeProjection(target, source) {
  return (0, _lodash.mergeWith)({}, (0, _lodash.cloneDeep)(target), source, (a, b) => {
    if ((0, _lodash.isPlainObject)(a) && (0, _lodash.isPlainObject)(b)) {
      return undefined;
    }

    return b;
  });
}