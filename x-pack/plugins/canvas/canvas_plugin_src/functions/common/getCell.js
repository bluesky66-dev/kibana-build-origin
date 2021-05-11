"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCell = getCell;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getCell() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().getCell;
  const errors = (0, _i18n.getFunctionErrors)().getCell;
  return {
    name: 'getCell',
    help,
    inputTypes: ['datatable'],
    args: {
      column: {
        types: ['string'],
        aliases: ['_', 'c'],
        help: argHelp.column
      },
      row: {
        types: ['number'],
        aliases: ['r'],
        help: argHelp.row,
        default: 0
      }
    },
    fn: (input, args) => {
      const row = input.rows[args.row];

      if (!row) {
        throw errors.rowNotFound(args.row);
      }

      const {
        column = input.columns[0].name
      } = args;
      const value = row[column];

      if (typeof value === 'undefined') {
        throw errors.columnNotFound(column);
      }

      return value;
    }
  };
}