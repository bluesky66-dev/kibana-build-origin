"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionSpecs = void 0;

var _browser = require("../canvas_plugin_src/functions/browser");

var _expressions = require("../../../../src/plugins/expressions");

var _functions = require("../public/functions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const functionSpecs = _browser.functions.concat(...(0, _functions.initFunctions)({})).map(fn => new _expressions.ExpressionFunction(fn()));

exports.functionSpecs = functionSpecs;