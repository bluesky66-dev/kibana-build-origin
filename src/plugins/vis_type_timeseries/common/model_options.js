"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODEL_TYPES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let MODEL_TYPES;
exports.MODEL_TYPES = MODEL_TYPES;

(function (MODEL_TYPES) {
  MODEL_TYPES["UNWEIGHTED"] = "simple";
  MODEL_TYPES["WEIGHTED_EXPONENTIAL"] = "ewma";
  MODEL_TYPES["WEIGHTED_EXPONENTIAL_DOUBLE"] = "holt";
  MODEL_TYPES["WEIGHTED_EXPONENTIAL_TRIPLE"] = "holt_winters";
  MODEL_TYPES["WEIGHTED_LINEAR"] = "linear";
})(MODEL_TYPES || (exports.MODEL_TYPES = MODEL_TYPES = {}));