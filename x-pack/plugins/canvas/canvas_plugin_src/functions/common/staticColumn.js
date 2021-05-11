"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.staticColumn = staticColumn;

var _common = require("@kbn/interpreter/common");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function staticColumn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().staticColumn;
  return {
    name: 'staticColumn',
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      name: {
        types: ['string'],
        aliases: ['_', 'column'],
        help: argHelp.name,
        required: true
      },
      value: {
        types: ['string', 'number', 'boolean', 'null'],
        help: argHelp.value,
        default: null
      }
    },
    fn: (input, args) => {
      const rows = input.rows.map(row => ({ ...row,
        [args.name]: args.value
      }));
      const type = (0, _common.getType)(args.value);
      const columns = [...input.columns];
      const existingColumnIndex = columns.findIndex(({
        name
      }) => name === args.name);
      const newColumn = {
        id: args.name,
        name: args.name,
        meta: {
          type
        }
      };

      if (existingColumnIndex > -1) {
        columns[existingColumnIndex] = newColumn;
      } else {
        columns.push(newColumn);
      }

      return {
        type: 'datatable',
        columns,
        rows
      };
    }
  };
}