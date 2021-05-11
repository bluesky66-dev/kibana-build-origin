"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagSpecs = void 0;

var _presentation = require("./presentation");

var _report = require("./report");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Registry expects a function that returns a spec object


const tagSpecs = [_presentation.presentation, _report.report];
exports.tagSpecs = tagSpecs;