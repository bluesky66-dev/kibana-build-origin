"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFunctionFactories = exports.renderFunctions = void 0;

var _embeddable = require("./embeddable");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const renderFunctions = [];
exports.renderFunctions = renderFunctions;
const renderFunctionFactories = [_embeddable.embeddableRendererFactory];
exports.renderFunctionFactories = renderFunctionFactories;