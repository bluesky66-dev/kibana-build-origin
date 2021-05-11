"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFunctionFactories = exports.renderFunctions = void 0;

var _embeddable = require("./embeddable");

var _filters = require("./filters");

var _core = require("./core");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const renderFunctions = [..._core.renderFunctions, ..._filters.renderFunctions, ..._embeddable.renderFunctions];
exports.renderFunctions = renderFunctions;
const renderFunctionFactories = [..._core.renderFunctionFactories, ..._embeddable.renderFunctionFactories, ..._filters.renderFunctionFactories];
exports.renderFunctionFactories = renderFunctionFactories;