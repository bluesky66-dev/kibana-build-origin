"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.table = table;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function table() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().table;
  return {
    name: 'table',
    aliases: [],
    type: 'render',
    inputTypes: ['datatable'],
    help,
    args: {
      font: {
        types: ['style'],
        default: '{font}',
        help: argHelp.font
      },
      paginate: {
        types: ['boolean'],
        default: true,
        help: argHelp.paginate,
        options: [true, false]
      },
      perPage: {
        types: ['number'],
        default: 10,
        help: argHelp.perPage
      },
      showHeader: {
        types: ['boolean'],
        default: true,
        help: argHelp.showHeader,
        options: [true, false]
      }
    },
    fn: (input, args) => {
      return {
        type: 'render',
        as: 'table',
        value: {
          datatable: input,
          ...args
        }
      };
    }
  };
}