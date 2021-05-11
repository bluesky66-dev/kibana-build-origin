"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIfRowsHaveFormulas = void 0;

var _lodash = require("lodash");

var _cell_has_formula = require("./cell_has_formula");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const checkIfRowsHaveFormulas = (flattened, fields) => {
  const pruned = (0, _lodash.pick)(flattened, fields);
  const cells = [...(0, _lodash.keys)(pruned), ...(0, _lodash.values)(pruned)];
  return (0, _lodash.some)(cells, cell => (0, _cell_has_formula.cellHasFormulas)(cell));
};

exports.checkIfRowsHaveFormulas = checkIfRowsHaveFormulas;