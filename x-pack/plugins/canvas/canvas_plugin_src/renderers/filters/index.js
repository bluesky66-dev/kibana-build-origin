"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFunctionFactories = exports.renderFunctions = void 0;

var _advanced_filter = require("./advanced_filter");

var _dropdown_filter = require("./dropdown_filter");

var _time_filter = require("./time_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const renderFunctions = [_advanced_filter.advancedFilter, _dropdown_filter.dropdownFilter];
exports.renderFunctions = renderFunctions;
const renderFunctionFactories = [_time_filter.timeFilterFactory];
exports.renderFunctionFactories = renderFunctionFactories;