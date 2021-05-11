"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exactly = exactly;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function exactly() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().exactly;
  return {
    name: 'exactly',
    aliases: [],
    type: 'filter',
    help,
    inputTypes: ['filter'],
    args: {
      column: {
        types: ['string'],
        aliases: ['field', 'c'],
        required: true,
        help: argHelp.column
      },
      value: {
        types: ['string'],
        aliases: ['v', 'val'],
        required: true,
        help: argHelp.value
      },
      filterGroup: {
        types: ['string'],
        help: argHelp.filterGroup
      }
    },
    fn: (input, args) => {
      const {
        value,
        column
      } = args;
      const filter = {
        type: 'filter',
        filterType: 'exactly',
        value,
        column,
        and: []
      };
      return { ...input,
        and: [...input.and, filter]
      };
    }
  };
}