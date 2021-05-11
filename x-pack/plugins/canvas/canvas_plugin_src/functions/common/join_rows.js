"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinRows = joinRows;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const escapeString = (data, quotechar) => {
  if (quotechar === undefined || quotechar === '') {
    return data;
  } else {
    const regex = new RegExp(quotechar, 'g');
    return data.replace(/\\/g, `\\\\`).replace(regex, `\\${quotechar}`);
  }
};

function joinRows() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().joinRows;
  const errors = (0, _i18n.getFunctionErrors)().joinRows;
  return {
    name: 'joinRows',
    type: 'string',
    help,
    inputTypes: ['datatable'],
    args: {
      column: {
        aliases: ['_'],
        types: ['string'],
        required: true,
        help: argHelp.column
      },
      distinct: {
        types: ['boolean'],
        help: argHelp.distinct,
        default: true
      },
      quote: {
        types: ['string'],
        help: argHelp.quote,
        default: `"'"`
      },
      separator: {
        aliases: ['sep', 'delimiter'],
        types: ['string'],
        help: argHelp.separator,
        default: ','
      }
    },
    fn: (input, {
      column,
      separator,
      quote,
      distinct
    }) => {
      const columnMatch = input.columns.find(col => col.name === column);

      if (!columnMatch) {
        throw errors.columnNotFound(column);
      }

      return input.rows.reduce((acc, row) => {
        const value = row[column];
        if (distinct && acc.includes(value)) return acc;
        return acc.concat(value);
      }, []).map(x => `${quote}${escapeString(x, quote)}${quote}`).join(separator);
    }
  };
}