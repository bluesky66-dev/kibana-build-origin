"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alterColumn = alterColumn;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function alterColumn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().alterColumn;
  const errors = (0, _i18n.getFunctionErrors)().alterColumn;
  return {
    name: 'alterColumn',
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      column: {
        aliases: ['_'],
        types: ['string'],
        required: true,
        help: argHelp.column
      },
      name: {
        types: ['string'],
        help: argHelp.name
      },
      type: {
        types: ['string'],
        help: argHelp.type,
        options: ['null', 'boolean', 'number', 'string', 'date']
      }
    },
    fn: (input, args) => {
      if (!args.column || !args.type && !args.name) {
        return input;
      }

      const column = input.columns.find(col => col.name === args.column);

      if (!column) {
        throw errors.columnNotFound(args.column);
      }

      const name = args.name || column.name;
      const type = args.type || column.meta.type;
      const columns = input.columns.reduce((all, col) => {
        if (col.name !== args.name) {
          if (col.name !== column.name) {
            all.push(col);
          } else {
            all.push({
              id: name,
              name,
              meta: {
                type
              }
            });
          }
        }

        return all;
      }, []);

      let handler = val => val;

      if (args.type) {
        handler = function getHandler() {
          switch (type) {
            case 'string':
              if (column.meta.type === 'date') {
                return v => new Date(v).toISOString();
              }

              return String;

            case 'number':
              return Number;

            case 'date':
              return v => new Date(v).valueOf();

            case 'boolean':
              return Boolean;

            case 'null':
              return () => null;

            default:
              throw errors.cannotConvertType(type);
          }
        }();
      }

      const rows = input.rows.map(row => ({ ...(0, _lodash.omit)(row, column.name),
        [name]: handler(row[column.name])
      }));
      return {
        type: 'datatable',
        columns,
        rows
      };
    }
  };
}