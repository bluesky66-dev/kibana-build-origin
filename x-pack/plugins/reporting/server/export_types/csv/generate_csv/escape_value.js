"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEscapeValue = createEscapeValue;

var _cell_has_formula = require("./cell_has_formula");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const nonAlphaNumRE = /[^a-zA-Z0-9]/;
const allDoubleQuoteRE = /"/g;

function createEscapeValue(quoteValues, escapeFormulas) {
  return function escapeValue(val) {
    if (val && typeof val === 'string') {
      const formulasEscaped = escapeFormulas && (0, _cell_has_formula.cellHasFormulas)(val) ? "'" + val : val;

      if (quoteValues && nonAlphaNumRE.test(formulasEscaped)) {
        return `"${formulasEscaped.replace(allDoubleQuoteRE, '""')}"`;
      }
    }

    return val == null ? '' : val.toString();
  };
}