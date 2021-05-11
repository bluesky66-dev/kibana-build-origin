"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cellHasFormulas = void 0;

var _lodash = require("lodash");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const cellHasFormulas = val => _constants.CSV_FORMULA_CHARS.some(formulaChar => (0, _lodash.startsWith)(val, formulaChar));

exports.cellHasFormulas = cellHasFormulas;