"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.head = head;

var _lodash = require("lodash");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function head() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().head;
  return {
    name: 'head',
    aliases: [],
    type: 'datatable',
    inputTypes: ['datatable'],
    help,
    args: {
      count: {
        aliases: ['_'],
        types: ['number'],
        help: argHelp.count,
        default: 1
      }
    },
    fn: (input, args) => ({ ...input,
      rows: (0, _lodash.take)(input.rows, args.count)
    })
  };
}