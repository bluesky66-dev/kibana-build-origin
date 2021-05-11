"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columns = columns;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function columns() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().columns;
  return {
    name: 'columns',
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      include: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.include
      },
      exclude: {
        types: ['string'],
        help: argHelp.exclude
      }
    },
    fn: (input, args) => {
      const {
        include,
        exclude
      } = args;
      const {
        columns: contextColumns,
        rows: contextRows,
        ...rest
      } = input;
      let result = { ...input
      };

      if (exclude) {
        const fields = exclude.split(',').map(field => field.trim());
        const cols = contextColumns.filter(col => !fields.includes(col.name));
        const rows = cols.length > 0 ? contextRows.map(row => (0, _lodash.omit)(row, fields)) : [];
        result = {
          rows,
          columns: cols,
          ...rest
        };
      }

      if (include) {
        const fields = include.split(',').map(field => field.trim()); // const columns = result.columns.filter(col => fields.includes(col.name));
        // Include columns in the order the user specified

        const cols = [];
        fields.forEach(field => {
          const column = (0, _lodash.find)(result.columns, {
            name: field
          });

          if (column) {
            cols.push(column);
          }
        });
        const rows = cols.length > 0 ? result.rows.map(row => (0, _lodash.pick)(row, fields)) : [];
        result = {
          rows,
          columns: cols,
          ...rest
        };
      }

      return result;
    }
  };
}