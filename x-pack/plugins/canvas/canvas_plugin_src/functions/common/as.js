"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asFn = asFn;

var _types = require("../../../types");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function asFn() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().as;
  return {
    name: 'as',
    type: 'datatable',
    inputTypes: ['string', 'boolean', 'number', 'null'],
    help,
    args: {
      name: {
        types: ['string'],
        aliases: ['_'],
        help: argHelp.name,
        default: 'value'
      }
    },
    fn: (input, args) => {
      return {
        type: 'datatable',
        columns: [{
          id: args.name,
          name: args.name,
          meta: {
            type: (0, _types.getType)(input)
          }
        }],
        rows: [{
          [args.name]: input
        }]
      };
    }
  };
}