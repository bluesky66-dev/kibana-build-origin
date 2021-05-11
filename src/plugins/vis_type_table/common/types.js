"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggTypes = exports.VIS_TYPE_TABLE = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const VIS_TYPE_TABLE = 'table';
exports.VIS_TYPE_TABLE = VIS_TYPE_TABLE;
let AggTypes;
exports.AggTypes = AggTypes;

(function (AggTypes) {
  AggTypes["SUM"] = "sum";
  AggTypes["AVG"] = "avg";
  AggTypes["MIN"] = "min";
  AggTypes["MAX"] = "max";
  AggTypes["COUNT"] = "count";
})(AggTypes || (exports.AggTypes = AggTypes = {}));