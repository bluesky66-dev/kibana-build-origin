"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapColumn = mapColumn;

var _types = require("../../../types");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mapColumn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().mapColumn;
  return {
    name: 'mapColumn',
    aliases: ['mc'],
    // midnight commander. So many times I've launched midnight commander instead of moving a file.
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
      expression: {
        types: ['boolean', 'number', 'string', 'null'],
        resolve: false,
        aliases: ['exp', 'fn', 'function'],
        help: argHelp.expression,
        required: true
      }
    },
    fn: (input, args) => {
      const expression = args.expression || (() => Promise.resolve(null));

      const columns = [...input.columns];
      const rowPromises = input.rows.map(row => {
        return expression({
          type: 'datatable',
          columns,
          rows: [row]
        }).then(val => ({ ...row,
          [args.name]: val
        }));
      });
      return Promise.all(rowPromises).then(rows => {
        const existingColumnIndex = columns.findIndex(({
          name
        }) => name === args.name);
        const type = rows.length ? (0, _types.getType)(rows[0][args.name]) : 'null';
        const newColumn = {
          id: args.name,
          name: args.name,
          meta: {
            type
          }
        };

        if (existingColumnIndex === -1) {
          columns.push(newColumn);
        } else {
          columns[existingColumnIndex] = newColumn;
        }

        return {
          type: 'datatable',
          columns,
          rows
        };
      });
    }
  };
}