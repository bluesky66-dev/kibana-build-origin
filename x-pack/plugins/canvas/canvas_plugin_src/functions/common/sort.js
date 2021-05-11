"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = sort;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function sort() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().sort;
  return {
    name: 'sort',
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      by: {
        types: ['string'],
        aliases: ['_', 'column'],
        multi: false,
        // TODO: No reason you couldn't.
        help: argHelp.by
      },
      reverse: {
        types: ['boolean'],
        help: argHelp.reverse,
        options: [true, false],
        default: false
      }
    },
    fn: (input, args) => {
      const column = args.by || input.columns[0].name;
      return { ...input,
        rows: args.reverse ? (0, _lodash.sortBy)(input.rows, column).reverse() : (0, _lodash.sortBy)(input.rows, column)
      };
    }
  };
}