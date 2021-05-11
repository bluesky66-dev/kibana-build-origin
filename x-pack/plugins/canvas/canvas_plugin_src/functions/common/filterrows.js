"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterrows = filterrows;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function filterrows() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().filterrows;
  return {
    name: 'filterrows',
    aliases: [],
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      fn: {
        resolve: false,
        aliases: ['_', 'exp', 'expression', 'function'],
        types: ['boolean'],
        required: true,
        help: argHelp.fn
      }
    },

    fn(input, {
      fn
    }) {
      const checks = input.rows.map(row => fn({ ...input,
        rows: [row]
      }));
      return Promise.all(checks).then(results => input.rows.filter((row, i) => results[i])).then(rows => ({ ...input,
        rows
      }));
    }

  };
}