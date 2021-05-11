"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelSpecs = void 0;

var _point_series = require("./point_series");

var _math = require("./math");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const modelSpecs = [_point_series.pointseries, _math.math];
exports.modelSpecs = modelSpecs;