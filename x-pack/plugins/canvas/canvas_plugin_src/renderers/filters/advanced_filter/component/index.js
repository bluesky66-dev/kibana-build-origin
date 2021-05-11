"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdvancedFilter = void 0;

var _recompose = require("recompose");

var _advanced_filter = require("./advanced_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AdvancedFilter = (0, _recompose.compose)((0, _recompose.withState)('value', 'onChange', ({
  value
}) => value || ''))(_advanced_filter.AdvancedFilter);
exports.AdvancedFilter = AdvancedFilter;